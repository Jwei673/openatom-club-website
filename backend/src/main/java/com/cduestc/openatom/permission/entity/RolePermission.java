package com.cduestc.openatom.permission.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("role_permissions")
public class RolePermission {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String role;
    private Long permissionId;
}
