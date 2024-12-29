package com.example.forohub.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "perfiles")
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;
}