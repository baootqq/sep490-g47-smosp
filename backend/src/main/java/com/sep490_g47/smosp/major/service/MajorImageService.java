package com.sep490_g47.smosp.major.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sep490_g47.smosp.major.entity.Major;
import com.sep490_g47.smosp.major.repository.MajorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MajorImageService {
    private final MajorRepository majorRepository;
    private final Cloudinary cloudinary;

    @Transactional
    public String uploadAndUpdateMajorImage(String code, MultipartFile file) {
        Major major = majorRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        try {
            Map params = ObjectUtils.asMap(
                    "public_id", code.toUpperCase().trim(),
                    "folder", "majors"
            );
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String publicUrl = uploadResult.get("secure_url").toString();
            
            major.setImageUrl(publicUrl);
            majorRepository.save(major);
            
            return publicUrl;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload to Cloudinary", e);
        }
    }
}
