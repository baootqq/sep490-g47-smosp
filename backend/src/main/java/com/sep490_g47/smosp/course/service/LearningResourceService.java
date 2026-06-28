package com.sep490_g47.smosp.course.service;

import org.springframework.web.multipart.MultipartFile;
import com.sep490_g47.smosp.course.enums.ResourceType;
import com.sep490_g47.smosp.course.dto.LearningResourceResponse;
import java.util.UUID;

public interface LearningResourceService {
    LearningResourceResponse uploadResource(UUID courseId, String title, ResourceType type, MultipartFile file, String linkUrl);
}
