package com.sep490_g47.smosp.major.service;

import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.entity.Major;
import com.sep490_g47.smosp.major.repository.MajorRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MajorServiceImplTest {

    @Mock
    private MajorRepository majorRepository;

    @InjectMocks
    private MajorServiceImpl majorService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAllMajors_WhenContentManager_ShouldReturnAllMajors() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken("user", "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CONTENT_MANAGER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        Major activeMajor = Major.builder().code("SE").isActive(true).build();
        Major inactiveMajor = Major.builder().code("IA").isActive(false).build();
        when(majorRepository.findAllByOrderByCodeAsc()).thenReturn(Arrays.asList(activeMajor, inactiveMajor));

        // Act
        List<MajorResponse> result = majorService.getAllMajors();

        // Assert
        assertEquals(2, result.size());
        verify(majorRepository).findAllByOrderByCodeAsc();
        verify(majorRepository, never()).findByIsActiveTrueOrderByCodeAsc();
    }

    @Test
    void getAllMajors_WhenStudent_ShouldReturnOnlyActiveMajors() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken("student", "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        Major activeMajor = Major.builder().code("SE").isActive(true).build();
        when(majorRepository.findByIsActiveTrueOrderByCodeAsc()).thenReturn(Collections.singletonList(activeMajor));

        // Act
        List<MajorResponse> result = majorService.getAllMajors();

        // Assert
        assertEquals(1, result.size());
        verify(majorRepository).findByIsActiveTrueOrderByCodeAsc();
        verify(majorRepository, never()).findAllByOrderByCodeAsc();
    }

    @Test
    void getAllMajors_WhenAnonymous_ShouldReturnOnlyActiveMajors() {
        // Arrange
        // No authentication set in SecurityContextHolder

        Major activeMajor = Major.builder().code("SE").isActive(true).build();
        when(majorRepository.findByIsActiveTrueOrderByCodeAsc()).thenReturn(Collections.singletonList(activeMajor));

        // Act
        List<MajorResponse> result = majorService.getAllMajors();

        // Assert
        assertEquals(1, result.size());
        verify(majorRepository).findByIsActiveTrueOrderByCodeAsc();
        verify(majorRepository, never()).findAllByOrderByCodeAsc();
    }
}
