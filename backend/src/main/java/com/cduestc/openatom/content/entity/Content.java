package com.cduestc.openatom.content.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("contents")
public class Content {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String title;
    private String content;
    private String summary;
    private String type; // news, notice, introduction
    private String coverImage;
    private Long authorId;
    private Integer viewCount;
    private String status; // draft, published, archived
    private LocalDateTime publishedAt;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Boolean deleted;
}
