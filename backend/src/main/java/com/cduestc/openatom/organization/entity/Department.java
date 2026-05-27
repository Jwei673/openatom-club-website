package com.cduestc.openatom.organization.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("departments")
public class Department {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String name;
    private String description;
    private Long parentId;
    private Long headId;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Boolean deleted;
}
