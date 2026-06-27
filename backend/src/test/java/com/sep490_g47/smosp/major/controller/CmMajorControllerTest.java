package com.sep490_g47.smosp.major.controller;

import com.sep490_g47.smosp.common.security.JwtAuthFilter;
import com.sep490_g47.smosp.common.security.UserDetailsServiceImpl;
import com.sep490_g47.smosp.major.service.MajorImageService;
import com.sep490_g47.smosp.major.service.MajorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@WebMvcTest(CmMajorController.class)
@Import(CmMajorControllerTest.TestSecurityConfig.class)
class CmMajorControllerTest {

    @TestConfiguration
    @EnableMethodSecurity
    static class TestSecurityConfig {
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MajorService majorService;

    @MockBean
    private MajorImageService majorImageService;

    @MockBean
    private com.sep490_g47.smosp.auth.service.JwtService jwtService;

    @MockBean
    private com.sep490_g47.smosp.common.security.UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser(roles = "CONTENT_MANAGER")
    void uploadMajorImage_Success_PNG() throws Exception {
        String expectedUrl = "https://cloudinary.com/image.png";
        when(majorImageService.uploadAndUpdateMajorImage(eq("SE"), any()))
                .thenReturn(expectedUrl);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.png",
                "image/png",
                "test image content".getBytes()
        );

        mockMvc.perform(multipart("/api/majors/SE/image")
                        .file(file)
                        .with(csrf()))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value(expectedUrl));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadMajorImage_Success_JPEG() throws Exception {
        String expectedUrl = "https://cloudinary.com/image.jpg";
        when(majorImageService.uploadAndUpdateMajorImage(eq("IA"), any()))
                .thenReturn(expectedUrl);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        mockMvc.perform(multipart("/api/majors/IA/image")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value(expectedUrl));
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void uploadMajorImage_ForbiddenForStudent() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.png",
                "image/png",
                "test content".getBytes()
        );

        mockMvc.perform(multipart("/api/majors/SE/image")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CONTENT_MANAGER")
    void uploadMajorImage_BadRequestForInvalidFormat() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test content".getBytes()
        );

        mockMvc.perform(multipart("/api/majors/SE/image")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "CONTENT_MANAGER")
    void uploadMajorImage_NotFoundIfMajorDoesNotExist() throws Exception {
        when(majorImageService.uploadAndUpdateMajorImage(eq("UNKNOWN"), any()))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.png",
                "image/png",
                "test content".getBytes()
        );

        mockMvc.perform(multipart("/api/majors/UNKNOWN/image")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
