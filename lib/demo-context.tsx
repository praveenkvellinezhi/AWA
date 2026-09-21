"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import {
  AdminConfig,
  AITool,
  Category,
  CustomizationVersion,
  FeedbackEntry,
  SubscriptionPlan,
  Template,
  UserProfile,
  UserRole,
} from "./types";
import { initialCategories } from "./mock-data/categories";
import { initialAITools } from "./mock-data/tools";
import { initialTemplates } from "./mock-data/templates";
import { initialFeedback } from "./mock-data/feedback";
import { initialAdminConfig } from "./mock-data/admin-config";

interface DemoContextType {
  // Role and Auth
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Subscription
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (plan: SubscriptionPlan) => void;
  subscribeUser: (plan: "yearly" | "lifetime") => Promise<boolean>;
  cancelSubscription: () => void;

  // Credits
  credits: number;
  setCredits: (credits: number) => void;
  addCredits: (amount: number) => void;
  consumeCredit: () => boolean;

  // Personal Collections
  likedTemplateIds: string[];
  savedTemplateIds: string[];
  toggleLike: (templateId: string) => boolean;
  toggleSave: (templateId: string) => boolean;
  isLiked: (templateId: string) => boolean;
  isSaved: (templateId: string) => boolean;

  // Customization & Version History
  customizationHistory: Record<string, CustomizationVersion[]>;
  activeCustomizedPrompts: Record<string, string>;
  recordCustomization: (templateId: string, requestText: string, resultPrompt: string) => void;
  revertToOriginal: (templateId: string) => void;
  switchCustomizationVersion: (templateId: string, versionId: string) => void;

  // Feedback
  feedbackList: FeedbackEntry[];
  submitFeedback: (feedback: Omit<FeedbackEntry, "id" | "createdAt" | "userId" | "userEmail">) => void;

  // Admin and Catalog Entities
  categories: Category[];
  templates: Template[];
  aiTools: AITool[];
  adminConfig: AdminConfig;
  updateAdminConfig: (partial: Partial<AdminConfig>) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, partial: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (templateId: string, partial: Partial<Template>) => void;
  deleteTemplate: (templateId: string) => void;
  addAITool: (tool: AITool) => void;
  updateAITool: (toolId: string, partial: Partial<AITool>) => void;
  toggleRetireAITool: (toolId: string) => void;

  // Demo Controls & Simulation
  simulateAIFailure: boolean;
  setSimulateAIFailure: (val: boolean) => void;
  simulatePaymentFailure: boolean;
  setSimulatePaymentFailure: (val: boolean) => void;
  guidedDemoStep: number;
  setGuidedDemoStep: (step: number) => void;
  isDemoControlsExpanded: boolean;
  setIsDemoControlsExpanded: (val: boolean) => void;
  resetDemoState: () => void;

  // Helpers & Auth Actions
  isSubscriber: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loginUser: (email?: string, name?: string, asSubscriber?: boolean) => void;
  loginAdmin: (email?: string) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  id: "usr-demo-1",
  email: "alex.creator@awa.guide",
  displayName: "Alex Creator",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  deviceLimit: 2,
  activeDevicesCount: 1,
};

const STORAGE_KEY = "awa_demo_state_v1";

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // States
  const [role, setRoleState] = useState<UserRole>("public");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscriptionPlan, setSubscriptionPlanState] = useState<SubscriptionPlan>(null);
  const [credits, setCreditsState] = useState<number>(0);
  const [likedTemplateIds, setLikedTemplateIds] = useState<string[]>([
    "template-dark-mode-ai-saas",
    "template-consentinel",
    "template-anchor-ai",
  ]);
  const [savedTemplateIds, setSavedTemplateIds] = useState<string[]>([
    "template-dark-mode-ai-saas",
    "template-3d-portfolio",
    "template-c-la-jewelry",
    "template-amber-editorial",
  ]);
  const [customizationHistory, setCustomizationHistory] = useState<Record<string, CustomizationVersion[]>>({});
  const [activeCustomizedPrompts, setActiveCustomizedPrompts] = useState<Record<string, string>>({});
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(initialFeedback);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [aiTools, setAiTools] = useState<AITool[]>(initialAITools);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(initialAdminConfig);

  // Simulation flags
  const [simulateAIFailure, setSimulateAIFailure] = useState<boolean>(false);
  const [simulatePaymentFailure, setSimulatePaymentFailure] = useState<boolean>(false);
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(0);
  const [isDemoControlsExpanded, setIsDemoControlsExpanded] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role) setRoleState(parsed.role);
        if (parsed.user) setUser(parsed.user);
        if (parsed.subscriptionPlan !== undefined) setSubscriptionPlanState(parsed.subscriptionPlan);
        if (parsed.credits !== undefined) setCreditsState(parsed.credits);
        if (parsed.likedTemplateIds) setLikedTemplateIds(parsed.likedTemplateIds);
        if (parsed.savedTemplateIds) setSavedTemplateIds(parsed.savedTemplateIds);
        if (parsed.customizationHistory) setCustomizationHistory(parsed.customizationHistory);
        if (parsed.activeCustomizedPrompts) setActiveCustomizedPrompts(parsed.activeCustomizedPrompts);
        if (parsed.feedbackList) setFeedbackList(parsed.feedbackList);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.templates) setTemplates(parsed.templates);
        if (parsed.aiTools) setAiTools(parsed.aiTools);
        if (parsed.adminConfig) setAdminConfig(parsed.adminConfig);
        if (parsed.simulateAIFailure !== undefined) setSimulateAIFailure(parsed.simulateAIFailure);
        if (parsed.simulatePaymentFailure !== undefined) setSimulatePaymentFailure(parsed.simulatePaymentFailure);
        if (parsed.guidedDemoStep !== undefined) setGuidedDemoStep(parsed.guidedDemoStep);
      }
    } catch (e) {
      console.warn("Could not read localStorage demo state:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        role,
        user,
        subscriptionPlan,
        credits,
        likedTemplateIds,
        savedTemplateIds,
        customizationHistory,
        activeCustomizedPrompts,
        feedbackList,
        categories,
        templates,
        aiTools,
        adminConfig,
        simulateAIFailure,
        simulatePaymentFailure,
        guidedDemoStep,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Could not save demo state to localStorage:", e);
    }
  }, [
    isLoaded,
    role,
    user,
    subscriptionPlan,
    credits,
    likedTemplateIds,
    savedTemplateIds,
    customizationHistory,
    activeCustomizedPrompts,
    feedbackList,
    categories,
    templates,
    aiTools,
    adminConfig,
    simulateAIFailure,
    simulatePaymentFailure,
    guidedDemoStep,
  ]);

  // Derived Access Flags
  const isSubscriber = role === "subscriber" || (subscriptionPlan !== null && role !== "public");
  const isAdmin = role === "admin";
  const isAuthenticated = role !== "public";

  // Role Switcher
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "public") {
      setUser(null);
      setSubscriptionPlanState(null);
    } else if (newRole === "authenticated") {
      setUser(defaultUser);
      setSubscriptionPlanState(null);
    } else if (newRole === "subscriber") {
      setUser(defaultUser);
      if (!subscriptionPlan) {
        setSubscriptionPlanState("yearly");
      }
      if (credits <= 0) {
        setCreditsState(adminConfig.freeCreditsAllotment);
      }
    } else if (newRole === "admin") {
      setUser({
        ...defaultUser,
        displayName: "Administrator",
        email: "admin@awa.guide",
      });
      setSubscriptionPlanState("lifetime");
      if (credits <= 0) {
        setCreditsState(50);
      }
    }
  };

  const setSubscriptionPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlanState(plan);
    if (plan && role === "public") {
      setRole("subscriber");
    } else if (plan && role === "authenticated") {
      setRole("subscriber");
    } else if (!plan && role === "subscriber") {
      setRole("authenticated");
    }
  };

  const subscribeUser = async (plan: "yearly" | "lifetime"): Promise<boolean> => {
    if (simulatePaymentFailure) {
      return false;
    }
    setSubscriptionPlanState(plan);
    setRoleState("subscriber");
    setUser(defaultUser);
    setCreditsState((prev) => Math.max(prev, adminConfig.freeCreditsAllotment));
    return true;
  };

  const cancelSubscription = () => {
    setSubscriptionPlanState(null);
    if (role === "subscriber") {
      setRoleState("authenticated");
    }
  };

  const loginUser = (email = "alex.creator@awa.guide", name = "Alex Creator", asSubscriber = false) => {
    setUser({
      ...defaultUser,
      email,
      displayName: name,
    });
    setRole(asSubscriber ? "subscriber" : "authenticated");
  };

  const loginAdmin = (email = "admin@awa.guide") => {
    setUser({
      ...defaultUser,
      displayName: "Administrator",
      email,
    });
    setRole("admin");
  };

  const logout = () => {
    setRole("public");
  };

  const setCredits = (amount: number) => {
    setCreditsState(Math.max(0, amount));
  };

  const addCredits = (amount: number) => {
    setCreditsState((prev) => prev + amount);
  };

  const consumeCredit = (): boolean => {
    if (credits <= 0) return false;
    setCreditsState((prev) => prev - 1);
    return true;
  };

  // Likes & Saves
  const toggleLike = (templateId: string): boolean => {
    const alreadyLiked = likedTemplateIds.includes(templateId);
    let newLikes: string[];
    if (alreadyLiked) {
      newLikes = likedTemplateIds.filter((id) => id !== templateId);
      // Decrement template like count
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, likesCount: Math.max(0, t.likesCount - 1) } : t))
      );
    } else {
      newLikes = [...likedTemplateIds, templateId];
      // Increment template like count
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, likesCount: t.likesCount + 1 } : t))
      );
    }
    setLikedTemplateIds(newLikes);
    return !alreadyLiked;
  };

  const toggleSave = (templateId: string): boolean => {
    const alreadySaved = savedTemplateIds.includes(templateId);
    let newSaves: string[];
    if (alreadySaved) {
      newSaves = savedTemplateIds.filter((id) => id !== templateId);
      // Decrement template save count
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, savesCount: Math.max(0, t.savesCount - 1) } : t))
      );
    } else {
      newSaves = [...savedTemplateIds, templateId];
      // Increment template save count
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, savesCount: t.savesCount + 1 } : t))
      );
    }
    setSavedTemplateIds(newSaves);
    return !alreadySaved;
  };

  const isLiked = (templateId: string) => likedTemplateIds.includes(templateId);
  const isSaved = (templateId: string) => savedTemplateIds.includes(templateId);

  // Customization management
  const recordCustomization = (templateId: string, requestText: string, resultPrompt: string) => {
    const existing = customizationHistory[templateId] || [];
    const newVersion: CustomizationVersion = {
      id: `ver-${Date.now()}`,
      templateId,
      versionNumber: existing.length + 1,
      requestText,
      resultPrompt,
      createdAt: new Date().toISOString(),
    };
    setCustomizationHistory((prev) => ({
      ...prev,
      [templateId]: [newVersion, ...existing],
    }));
    setActiveCustomizedPrompts((prev) => ({
      ...prev,
      [templateId]: resultPrompt,
    }));
  };

  const revertToOriginal = (templateId: string) => {
    setActiveCustomizedPrompts((prev) => {
      const next = { ...prev };
      delete next[templateId];
      return next;
    });
  };

  const switchCustomizationVersion = (templateId: string, versionId: string) => {
    const versions = customizationHistory[templateId] || [];
    const found = versions.find((v) => v.id === versionId);
    if (found) {
      setActiveCustomizedPrompts((prev) => ({
        ...prev,
        [templateId]: found.resultPrompt,
      }));
    }
  };

  // Feedback
  const submitFeedback = (entry: Omit<FeedbackEntry, "id" | "createdAt" | "userId" | "userEmail">) => {
    const newEntry: FeedbackEntry = {
      ...entry,
      id: `fb-${Date.now()}`,
      userId: user?.id || "anon",
      userEmail: user?.email || "anonymous@visitor.com",
      createdAt: new Date().toISOString(),
    };
    setFeedbackList((prev) => [newEntry, ...prev]);
  };

  // Admin Config and Entities
  const updateAdminConfig = (partial: Partial<AdminConfig>) => {
    setAdminConfig((prev) => ({ ...prev, ...partial }));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (categoryId: string, partial: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, ...partial } : cat))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const addTemplate = (template: Template) => {
    setTemplates((prev) => [template, ...prev]);
  };

  const updateTemplate = (templateId: string, partial: Partial<Template>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, ...partial } : t))
    );
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  const addAITool = (tool: AITool) => {
    setAiTools((prev) => [...prev, tool]);
  };

  const updateAITool = (toolId: string, partial: Partial<AITool>) => {
    setAiTools((prev) =>
      prev.map((tool) => (tool.id === toolId ? { ...tool, ...partial } : tool))
    );
  };

  const toggleRetireAITool = (toolId: string) => {
    setAiTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, isRetired: !tool.isRetired } : tool
      )
    );
  };

  // Reset demo state
  const resetDemoState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
    setRoleState("public");
    setUser(null);
    setSubscriptionPlanState(null);
    setCreditsState(0);
    setLikedTemplateIds([]);
    setSavedTemplateIds([]);
    setCustomizationHistory({});
    setActiveCustomizedPrompts({});
    setFeedbackList(initialFeedback);
    setCategories(initialCategories);
    setTemplates(initialTemplates);
    setAiTools(initialAITools);
    setAdminConfig(initialAdminConfig);
    setSimulateAIFailure(false);
    setSimulatePaymentFailure(false);
    setGuidedDemoStep(0);
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        subscriptionPlan,
        setSubscriptionPlan,
        subscribeUser,
        cancelSubscription,
        credits,
        setCredits,
        addCredits,
        consumeCredit,
        likedTemplateIds,
        savedTemplateIds,
        toggleLike,
        toggleSave,
        isLiked,
        isSaved,
        customizationHistory,
        activeCustomizedPrompts,
        recordCustomization,
        revertToOriginal,
        switchCustomizationVersion,
        feedbackList,
        submitFeedback,
        categories,
        templates,
        aiTools,
        adminConfig,
        updateAdminConfig,
        addCategory,
        updateCategory,
        deleteCategory,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addAITool,
        updateAITool,
        toggleRetireAITool,
        simulateAIFailure,
        setSimulateAIFailure,
        simulatePaymentFailure,
        setSimulatePaymentFailure,
        guidedDemoStep,
        setGuidedDemoStep,
        isDemoControlsExpanded,
        setIsDemoControlsExpanded,
        resetDemoState,
        isSubscriber,
        isAdmin,
        isAuthenticated,
        loginUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
