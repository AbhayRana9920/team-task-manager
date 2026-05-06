package com.ttm.controller;

import com.ttm.dto.response.ApiResponse;
import com.ttm.dto.response.DashboardResponse;
import com.ttm.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<DashboardResponse>> getAdminDashboard(Authentication authentication) {
        DashboardResponse response = dashboardService.getAdminDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/member")
    public ResponseEntity<ApiResponse<DashboardResponse>> getMemberDashboard(Authentication authentication) {
        DashboardResponse response = dashboardService.getMemberDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
