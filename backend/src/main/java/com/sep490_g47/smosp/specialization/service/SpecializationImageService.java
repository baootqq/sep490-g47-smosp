package com.sep490_g47.smosp.specialization.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sep490_g47.smosp.specialization.entity.Specialization;
import com.sep490_g47.smosp.specialization.repository.SpecializationRepository;
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
public class SpecializationImageService {

    private final SpecializationRepository specializationRepository;
    private final Cloudinary cloudinary;

    @Transactional
    public String uploadAndUpdateSpecializationImage(String code, MultipartFile file) {
        Specialization specialization = specializationRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialization not found"));

        try {
            Map params = ObjectUtils.asMap(
                    "public_id", code.toUpperCase().trim(),
                    "folder", "specializations"
            );
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String publicUrl = uploadResult.get("secure_url").toString();
            
            specialization.setImageUrl(publicUrl);
            specializationRepository.save(specialization);
            
            return publicUrl;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload to Cloudinary", e);
        }
    }
}
