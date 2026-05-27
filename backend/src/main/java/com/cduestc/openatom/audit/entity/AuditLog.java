package com.cduestc.openatom.audit.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("audit_logs")
public class AuditLog {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private Long userId;
    private String action;
    private String details;
    private String ipAddress;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
