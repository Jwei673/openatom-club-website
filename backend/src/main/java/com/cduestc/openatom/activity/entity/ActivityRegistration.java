package com.cduestc.openatom.activity.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("activity_registrations")
public class ActivityRegistration {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private Long activityId;
    private Long userId;
    private String status; // registered, attended, cancelled
    private LocalDateTime registeredAt;
}
