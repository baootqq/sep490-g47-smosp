package com.sep490_g47.smosp.major.controller;

import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.service.MajorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/majors")
@RequiredArgsConstructor
public class PublicMajorController {

    private final MajorService majorService;

    @GetMapping
    public ResponseEntity<List<MajorResponse>> getAllMajors() {
        return ResponseEntity.ok(majorService.getAllMajors());
    }
}
