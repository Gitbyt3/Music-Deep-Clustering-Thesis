import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class Encoder(nn.Module):
    def __init__(self, input_dim, hidden_dims, latent_dim):
        super(Encoder, self).__init__()

        layers = []
        prev_dim = input_dim
        for h_dim in hidden_dims:
            layers.append(nn.Linear(prev_dim, h_dim))
            layers.append(nn.BatchNorm1d(h_dim))
            layers.append(nn.LeakyReLU(0.2))
            layers.append(nn.Dropout(0.2))
            prev_dim = h_dim
        self.encoder = nn.Sequential(*layers)

        self.mu = nn.Linear(hidden_dims[-1], latent_dim)
        self.logvar = nn.Linear(hidden_dims[-1], latent_dim)

    def forward(self, X):
        X = self.encoder(X)
        mu, logvar = self.mu(X), self.logvar(X)
        std = torch.exp(0.5 * logvar)
        z = mu + std * torch.randn_like(std)
        return mu, logvar, z

class Decoder(nn.Module):
    def __init__(self, input_dim, hidden_dims, latent_dim):
        super(Decoder, self).__init__()

        layers = []
        prev_dim = latent_dim
        for h_dim in hidden_dims[::-1]:
            layers.append(nn.Linear(prev_dim, h_dim))
            layers.append(nn.BatchNorm1d(h_dim))
            layers.append(nn.LeakyReLU(0.2))
            layers.append(nn.Dropout(0.2))
            prev_dim = h_dim
        self.decoder = nn.Sequential(*layers)

        self.reconstructed = nn.Linear(hidden_dims[0], input_dim)

    def forward(self, z):
        z = self.decoder(z)
        return self.reconstructed(z)

class AVencoder(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(AVencoder, self).__init__()
        self.encoder = nn.Sequential(nn.Linear(input_dim, 64),
                                     nn.ReLU(),
                                     nn.Linear(64, output_dim))
        self.norm = nn.LayerNorm(output_dim)

    def forward(self, av):
        av = self.encoder(av)
        return self.norm(av)

class ProjectionHead(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(ProjectionHead, self).__init__()
        self.projector = nn.Sequential(nn.Linear(input_dim, output_dim, bias=False),
                                       nn.BatchNorm1d(output_dim),
                                       nn.ReLU(),
                                       nn.Linear(output_dim, output_dim, bias=False),
                                       nn.BatchNorm1d(output_dim, affine=False))
    def forward(self, x):
        return self.projector(x)

class VaDE(nn.Module):
    def __init__(self, input_dim, hidden_dims, latent_dim, n_clusters):
        super(VaDE, self).__init__()
        self.input_dim, self.hidden_dims, self.latent_dim, self.n_clusters = input_dim, hidden_dims, latent_dim, n_clusters

        self.encoder = Encoder(input_dim, hidden_dims, latent_dim)
        self.decoder = Decoder(input_dim, hidden_dims, latent_dim)

        self.cluster_weights = nn.Parameter(torch.ones(n_clusters)/n_clusters)
        self.cluster_means = nn.Parameter(torch.randn(n_clusters, latent_dim) * 0.05)
        self.cluster_logvars = nn.Parameter(torch.randn(n_clusters, latent_dim) * 0.05 - 1)

        self.av_encoder = AVencoder(input_dim=2, output_dim=latent_dim)
        self.projector = ProjectionHead(input_dim=latent_dim, output_dim=latent_dim)

    def forward(self, X, AV):
        mu, logvar, z = self.encoder(X)
        recon_X = self.decoder(z)
        av_encoded = self.av_encoder(AV)
        return mu, logvar, z, recon_X, av_encoded
    
    def cluster_probabilities(self, z):
        cluster_weights = torch.softmax(self.cluster_weights, dim=0)
        cluster_logvars = self.cluster_logvars.clamp(min=-10, max=10)
        cluster_vars = torch.exp(cluster_logvars) + 1e-8

        z = z.unsqueeze(1).expand(-1, self.n_clusters, -1)

        log_2pi = np.log(2 * np.pi)
        squared_diff = (z - self.cluster_means).pow(2)
        log_prob_z_given_c = -0.5 * (torch.sum(cluster_logvars + squared_diff / cluster_vars, dim=2) + self.latent_dim * log_2pi)
        log_prob_c_given_z = torch.log(cluster_weights.unsqueeze(0) + 1e-8) + log_prob_z_given_c
        gamma = torch.softmax(log_prob_c_given_z, dim=1)
        return gamma

    def loss(self, X, recon_X, mu, logvar, gamma, current_epoch):
        recon_loss = F.mse_loss(recon_X, X, reduction='sum') / (X.size(0) + 1e-10)
        
        logvar = logvar.clamp(min=-15, max=15)
        cluster_logvars = self.cluster_logvars.clamp(min=-15, max=15)
        
        var = torch.exp(logvar) + 1e-10
        cluster_vars = torch.exp(cluster_logvars) + 1e-10
        
        mu = mu.unsqueeze(1)
        var = var.unsqueeze(1)
        
        kl_z_per_cluster = 0.5 * (
            cluster_logvars.unsqueeze(0) - logvar.unsqueeze(1) + 
            (var + (mu - self.cluster_means.unsqueeze(0)).pow(2)) / cluster_vars.unsqueeze(0) - 1
        )
        
        kl_z = torch.sum(gamma.unsqueeze(-1) * kl_z_per_cluster, dim=[1,2]).mean()
        
        log_gamma = torch.log(gamma + 1e-20)
        cluster_weights = torch.softmax(self.cluster_weights, dim=0)
        kl_c = torch.sum(gamma * (log_gamma - torch.log(cluster_weights.unsqueeze(0)) + 1e-20), dim=1).mean()
        
        kl_weight = min(1.0, current_epoch/150 * 1.0)
        total_loss = recon_loss + kl_weight * (kl_z + kl_c)
        
        return total_loss, recon_loss, kl_z, kl_c

    def contrastive_loss(self, z_projected, av_projected, cluster_labels, temperature=0.1):
        z_projected = z_projected / (z_projected.norm(dim=1, keepdim=True) + 1e-10)
        av_projected = av_projected / (av_projected.norm(dim=1, keepdim=True) + 1e-10)
        
        sim_matrix = torch.mm(z_projected, av_projected.t()) / temperature
        
        pos_mask = (cluster_labels.unsqueeze(1) == cluster_labels.unsqueeze(0)).float()
        pos_mask.fill_diagonal_(0)
        
        max_sim = sim_matrix.max(dim=1, keepdim=True)[0].detach()
        exp_sim = torch.exp(sim_matrix - max_sim)
        
        pos_term = (exp_sim * pos_mask).sum(dim=1)
        neg_term = (exp_sim * (1 - pos_mask)).sum(dim=1)
        
        loss = -(torch.log(pos_term + 1e-10) - torch.log(neg_term + 1e-10)).mean()
        return loss

    def predict_cluster(self, x):
        with torch.no_grad():
            _, _, z = self.encoder(x)
            soft_clusters = self.cluster_probabilities(z)
            return z, torch.argmax(soft_clusters, dim=1)