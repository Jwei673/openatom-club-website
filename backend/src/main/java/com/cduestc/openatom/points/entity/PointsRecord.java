package com.cduestc.openatom.points.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("points_records")
public class PointsRecord {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private Long userId;
    private Integer points;
    private String type; // activity, project, contribution, reward, penalty
    private String description;
    private Long relatedId; // 关联的活动ID或项目ID
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
