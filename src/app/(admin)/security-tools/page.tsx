"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { ArrowRightIcon } from "@/icons/index";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Zap, 
  Server, 
  Network, 
  Database, 
  Globe, 
  ShoppingCart, 
  Key, 
  Settings, 
  Users,
  BarChart3,
  FileText
} from "lucide-react";
import { toast } from "react-hot-toast";

// Tool interface
interface SecurityTool {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  icon: React.ReactNode;
  features: string[];
  status: "active" | "inactive" | "maintenance";
  lastUpdated: string;
}

// Tool categories
const toolCategories = [
  {
    id: "scanning",
    name: "Scanning Tools",
    description: "Core scanning modules for comprehensive security analysis",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
  },
  {
    id: "wordpress",
    name: "WordPress Security",
    description: "Advanced WordPress vulnerability scanning and protection",
    icon: <Globe className="w-5 h-5" />,
    color: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
  },
  {
    id: "ecommerce",
    name: "E-commerce Security",
    description: "Specialized scanning for Shopify and other e-commerce platforms",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
  },
  {
    id: "authentication",
    name: "Authentication Security",
    description: "Advanced authentication and access control security tools",
    icon: <Lock className="w-5 h-5" />,
    color: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
  },
  {
    id: "compliance",
    name: "Compliance & Reporting",
    description: "GDPR, PCI-DSS compliance checking and security reporting",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
  }
];

// Mock data for security tools
const mockTools: SecurityTool[] = [
  // Scanning Tools
  {
    id: "port-scanner",
    name: "Port Scanner",
    description: "Comprehensive port scanning to identify open ports and services",
    category: "scanning",
    isEnabled: true,
    icon: <Zap className="w-5 h-5" />,
    features: ["TCP/UDP scanning", "Service detection", "Vulnerability mapping", "Custom port ranges"],
    status: "active",
    lastUpdated: "2 hours ago"
  },
  {
    id: "network-scanner",
    name: "Network Scanner",
    description: "Advanced network discovery and topology analysis",
    category: "scanning",
    isEnabled: true,
    icon: <Network className="w-5 h-5" />,
    features: ["Network mapping", "Device discovery", "Traffic analysis", "Topology visualization"],
    status: "active",
    lastUpdated: "1 hour ago"
  },
  {
    id: "server-scanner",
    name: "Server Scanner",
    description: "Deep server analysis for configuration and security issues",
    category: "scanning",
    isEnabled: false,
    icon: <Server className="w-5 h-5" />,
    features: ["Server configuration", "Service enumeration", "Security headers", "SSL/TLS analysis"],
    status: "inactive",
    lastUpdated: "3 days ago"
  },
  {
    id: "database-scanner",
    name: "Database Scanner",
    description: "Database security assessment and vulnerability detection",
    category: "scanning",
    isEnabled: true,
    icon: <Database className="w-5 h-5" />,
    features: ["SQL injection testing", "Database enumeration", "Permission analysis", "Data exposure checks"],
    status: "active",
    lastUpdated: "4 hours ago"
  },

  // WordPress Security
  {
    id: "wordpress-scanner",
    name: "WordPress Security Scanner",
    description: "Comprehensive WordPress vulnerability scanning and security analysis",
    category: "wordpress",
    isEnabled: true,
    icon: <Globe className="w-5 h-5" />,
    features: ["Plugin vulnerabilities", "Theme security", "Core WordPress issues", "User enumeration"],
    status: "active",
    lastUpdated: "1 hour ago"
  },
  {
    id: "wp-brute-force",
    name: "WordPress Brute Force Protection",
    description: "Advanced brute force attack detection and prevention",
    category: "wordpress",
    isEnabled: false,
    icon: <Lock className="w-5 h-5" />,
    features: ["Login attempt monitoring", "IP blocking", "Rate limiting", "Attack pattern detection"],
    status: "inactive",
    lastUpdated: "2 days ago"
  },

  // E-commerce Security
  {
    id: "shopify-scanner",
    name: "Shopify Security Scanner",
    description: "Specialized security scanning for Shopify stores and applications",
    category: "ecommerce",
    isEnabled: true,
    icon: <ShoppingCart className="w-5 h-5" />,
    features: ["Store configuration", "Payment security", "API vulnerabilities", "Third-party app analysis"],
    status: "active",
    lastUpdated: "2 hours ago"
  },
  {
    id: "ecommerce-payment",
    name: "Payment Security Scanner",
    description: "PCI-DSS compliance and payment security validation",
    category: "ecommerce",
    isEnabled: false,
    icon: <Shield className="w-5 h-5" />,
    features: ["PCI-DSS compliance", "Payment form security", "SSL certificate validation", "Data encryption checks"],
    status: "maintenance",
    lastUpdated: "1 week ago"
  },

  // Authentication Security
  {
    id: "brute-force-checker",
    name: "Brute Force Checker",
    description: "Advanced brute force attack detection and prevention system",
    category: "authentication",
    isEnabled: true,
    icon: <Key className="w-5 h-5" />,
    features: ["Attack pattern detection", "IP reputation analysis", "Behavioral analysis", "Real-time blocking"],
    status: "active",
    lastUpdated: "30 minutes ago"
  },
  {
    id: "auth-bypass",
    name: "Authentication Bypass Detector",
    description: "Detection of authentication bypass vulnerabilities and weak points",
    category: "authentication",
    isEnabled: true,
    icon: <AlertTriangle className="w-5 h-5" />,
    features: ["Session management", "Token validation", "Multi-factor bypass", "Privilege escalation"],
    status: "active",
    lastUpdated: "1 hour ago"
  },

  // Compliance & Reporting
  {
    id: "gdpr-scanner",
    name: "GDPR Compliance Scanner",
    description: "Comprehensive GDPR compliance checking and data protection analysis",
    category: "compliance",
    isEnabled: true,
    icon: <CheckCircle className="w-5 h-5" />,
    features: ["Data collection analysis", "Privacy policy validation", "Cookie compliance", "Data retention checks"],
    status: "active",
    lastUpdated: "3 hours ago"
  },
  {
    id: "security-reporting",
    name: "Security Reporting Engine",
    description: "Automated security report generation and compliance documentation",
    category: "compliance",
    isEnabled: false,
    icon: <BarChart3 className="w-5 h-5" />,
    features: ["Automated reports", "Compliance documentation", "Risk assessment", "Executive summaries"],
    status: "inactive",
    lastUpdated: "5 days ago"
  }
];

export default function SecurityTools() {
  const [tools, setTools] = useState<SecurityTool[]>(mockTools);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter tools based on category and search
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle tool status
  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool => 
      tool.id === toolId 
        ? { ...tool, isEnabled: !tool.isEnabled, lastUpdated: "Just now" }
        : tool
    ));
    const tool = tools.find(t => t.id === toolId);
    toast.success(`${tool?.name} ${!tool?.isEnabled ? 'enabled' : 'disabled'} successfully!`);
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return toolCategories.find(cat => cat.id === categoryId);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400";
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "maintenance": return "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Tools Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Control and manage security tools available in customer ElectronJS applications</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            startIcon={<Settings className="w-4 h-4" />}
          >
            Global Settings
          </Button>
          <Button
            startIcon={<Shield className="w-4 h-4" />}
          >
            Deploy Updates
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search security tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "primary" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All Tools
          </Button>
          {toolCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Overview */}
      {selectedCategory === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCategories.map(category => {
            const categoryTools = tools.filter(tool => tool.category === category.id);
            const enabledTools = categoryTools.filter(tool => tool.isEnabled).length;
            
            return (
              <div key={category.id} className={`rounded-xl border p-6 ${category.color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {enabledTools} of {categoryTools.length} tools enabled
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCategory(category.id)}
                    endIcon={<ArrowRightIcon />}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div key={tool.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getCategoryInfo(tool.category)?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}>
                  {tool.status}
                </span>
                <button
                  onClick={() => toggleTool(tool.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tool.isEnabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tool.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tool Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md text-gray-700 dark:text-gray-300">
                    +{tool.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Tool Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated {tool.lastUpdated}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<Settings className="w-4 h-4" />}
                >
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<AlertTriangle className="w-4 h-4" />}
                >
                  Logs
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
