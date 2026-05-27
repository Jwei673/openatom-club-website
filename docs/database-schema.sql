-- 开放原子开源社团官网系统数据库表结构
-- PostgreSQL 数据库脚本

-- 创建数据库（如果不存在）
-- CREATE DATABASE openatom_club;

-- 切换到数据库
-- \c openatom_club;

-- 用户表
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50),
    student_id VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    department_id BIGINT,
    position VARCHAR(50),
    points INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'member',
    status VARCHAR(20) DEFAULT 'active',
    last_login_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

-- 部门表
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT,
    head_id BIGINT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

-- 权限表
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色权限关联表
CREATE TABLE role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    permission_id BIGINT NOT NULL,
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- 内容表（新闻、通知等）
CREATE TABLE contents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(500),
    type VARCHAR(20) NOT NULL, -- news, notice, introduction
    cover_image VARCHAR(255),
    author_id BIGINT,
    view_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 活动表
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    cover_image VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location VARCHAR(200),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    organizer_id BIGINT,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- 活动报名表
CREATE TABLE activity_registrations (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'registered', -- registered, attended, cancelled
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(activity_id, user_id)
);

-- 项目表
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    repository_url VARCHAR(255),
    demo_url VARCHAR(255),
    leader_id BIGINT,
    status VARCHAR(20) DEFAULT 'recruiting', -- recruiting, developing, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- 项目成员表
CREATE TABLE project_members (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(project_id, user_id)
);

-- 积分记录表
CREATE TABLE points_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    points INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL, -- activity, project, contribution, reward, penalty
    description TEXT,
    related_id BIGINT, -- 关联的活动ID或项目ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 审批表
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- join_club, activity, project, points
    applicant_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    reviewer_id BIGINT,
    review_comment TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- 文件表
CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploader_id BIGINT,
    related_type VARCHAR(50), -- avatar, content, activity, project
    related_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- 系统设置表
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(50) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_author ON contents(author_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_time ON activities(start_time);
CREATE INDEX idx_activity_registrations_activity ON activity_registrations(activity_id);
CREATE INDEX idx_activity_registrations_user ON activity_registrations(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_points_records_user ON points_records(user_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_applicant ON approvals(applicant_id);

-- 初始化权限数据
INSERT INTO permissions (name, code, description) VALUES
('用户管理', 'user:manage', '管理用户信息'),
('部门管理', 'department:manage', '管理部门信息'),
('内容管理', 'content:manage', '管理新闻通知内容'),
('活动管理', 'activity:manage', '管理活动'),
('项目管理', 'project:manage', '管理项目'),
('审批管理', 'approval:manage', '管理审批流程'),
('积分管理', 'points:manage', '管理积分'),
('系统设置', 'system:settings', '管理系统设置'),
('审计查看', 'audit:view', '查看审计日志');

-- 初始化角色权限关联（社长）
INSERT INTO role_permissions (role, permission_id) 
SELECT 'president', id FROM permissions;

-- 初始化角色权限关联（管理员）
INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', id FROM permissions WHERE code NOT IN ('system:settings', 'audit:view');

-- 初始化系统设置
INSERT INTO settings (key, value, description) VALUES
('site_name', '开放原子开源社团', '网站名称'),
('site_description', '电子科技大学成都学院开放原子开源社团官网', '网站描述'),
('contact_email', 'contact@cduestc-openatom.org', '联系邮箱'),
('contact_phone', '028-12345678', '联系电话'),
('address', '四川省成都市电子科技大学成都学院', '地址');
