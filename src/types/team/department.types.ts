// src/types/team/department.types.ts

export interface Department {
 id: string;
 name: string;
 description?: string;
 parentId?: string;
 memberCount: number;
 createdAt: string;
 updatedAt: string;
 subDepartments?: Department[];
 members?: DepartmentMember[];
}

export interface DepartmentMember {
 id: string;
 name: string;
 role: string;
 email: string;
 joinedAt: string;
}

export interface CreateDepartmentInput {
 name: string;
 description?: string;
 parentId?: string;
}

export interface UpdateDepartmentInput {
 name?: string;
 description?: string;
 parentId?: string;
}

export interface DepartmentResponse {
 data?: Department;
 error?: string;
}

export interface DepartmentsResponse {
 data?: Department[];
 error?: string;
}

export interface DepartmentMembersResponse {
 data?: DepartmentMember[];
 error?: string;
}

export interface AddMemberInput {
 userId: string;
 role: string;
}
