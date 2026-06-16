package com.sep490_g47.smosp.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "oauth_identities",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_user_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OauthIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(nullable = false, length = 50)
    private String provider; // "google"

    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;
}
