package com.cduestc.openatom.setting.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("settings")
public class Setting {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String key;
    private String value;
    private String description;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
