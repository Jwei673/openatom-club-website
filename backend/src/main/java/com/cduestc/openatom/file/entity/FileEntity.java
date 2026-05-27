package com.cduestc.openatom.file.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("files")
public class FileEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String originalName;
    private String storedName;
    private String filePath;
    private Long fileSize;
    private String mimeType;
    private Long uploaderId;
    private String relatedType; // avatar, content, activity, project
    private Long relatedId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
