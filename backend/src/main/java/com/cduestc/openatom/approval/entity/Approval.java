package com.cduestc.openatom.approval.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("approvals")
public class Approval {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String type; // join_club, activity, project, points
    private Long applicantId;
    private String title;
    private String description;
    private String status; // pending, approved, rejected
    private Long reviewerId;
    private String reviewComment;
    private LocalDateTime reviewedAt;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
