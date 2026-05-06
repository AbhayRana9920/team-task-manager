package com.ttm.config;

import com.ttm.entity.User;
import com.ttm.enums.Role;
import com.ttm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed admin user
        if (!userRepository.existsByEmail("admin@test.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@test.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: admin@test.com / admin123");
        }

        // Seed member user
        if (!userRepository.existsByEmail("member@test.com")) {
            User member = User.builder()
                    .name("Member User")
                    .email("member@test.com")
                    .password(passwordEncoder.encode("member123"))
                    .role(Role.MEMBER)
                    .build();
            userRepository.save(member);
            System.out.println("✅ Member user seeded: member@test.com / member123");
        }
    }
}
