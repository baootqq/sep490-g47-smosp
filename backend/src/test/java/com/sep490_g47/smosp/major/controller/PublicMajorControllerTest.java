package com.sep490_g47.smosp.major.controller;

import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.service.MajorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sep490_g47.smosp.common.config.SecurityConfig;
import com.sep490_g47.smosp.common.security.JwtAuthFilter;

@WebMvcTest(PublicMajorController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class})
public class PublicMajorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MajorService majorService;

    @MockitoBean
    private com.sep490_g47.smosp.auth.service.JwtService jwtService;

    @MockitoBean
    private com.sep490_g47.smosp.common.security.UserDetailsServiceImpl userDetailsService;

    @Test
    void getAllMajors_ShouldReturn200() throws Exception {
        // Arrange
        MajorResponse response1 = MajorResponse.builder().code("SE").name("Software Eng").isActive(true).build();
        MajorResponse response2 = MajorResponse.builder().code("IA").name("Info Assurance").isActive(false).build();
        
        when(majorService.getAllMajors()).thenReturn(Arrays.asList(response1, response2));

        // Act & Assert
        mockMvc.perform(get("/api/majors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].code").value("SE"))
                .andExpect(jsonPath("$[1].code").value("IA"));
    }
}
