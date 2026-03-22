export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  username: string;
}

interface StoredUser extends User {
  password: string;
}

interface UserCredentials {
  id: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

class AuthStore {
  private users: Map<string, UserCredentials> = new Map();
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.users.set("demo@cityfix.com", {
      id: "user-demo",
      email: "demo@cityfix.com",
      phoneNumber: "123-555-0123",
      username: "DemoUser",
      password: "demo123",
    });

    const savedUser = localStorage.getItem("cityfix_user");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  signUp(credentials: UserCredentials): { success: boolean; error?: string } {
    if (this.users.has(credentials.email)) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === credentials.username.toLowerCase()) {
        return { success: false, error: "This username is already taken" };
      }
    }

    const storedUser: StoredUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      phoneNumber: credentials.phoneNumber,
      username: credentials.username,
      password: credentials.password,
    };

    this.users.set(credentials.email, credentials);

    this.currentUser = {
      id: storedUser.id,
      email: storedUser.email,
      phoneNumber: storedUser.phoneNumber,
      username: storedUser.username,
    };

    localStorage.setItem("cityfix_user", JSON.stringify(this.currentUser));
    this.notify();

    return { success: true };
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const user = this.users.get(email);

    if (!user) {
      return { success: false, error: "No account found with this email" };
    }

    if (user.password !== password) {
      return { success: false, error: "Incorrect Password" };
    }

    this.currentUser = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      username: user.username,
    };

    localStorage.setItem("cityfix_user", JSON.stringify(this.currentUser));
    this.notify();

    return { success: true };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("cityfix_user");
    this.notify();
  }

  updateProfile(updates: {
    email: string;
    phoneNumber: string;
    username: string;
  }): { success: boolean; error?: string } {
    if (!this.currentUser) {
      return { success: false, error: "Not logged in" };
    }

    if (updates.email !== this.currentUser.email) {
      for (const [email] of this.users.entries()) {
        if (email === updates.email && email !== this.currentUser.email) {
          return { success: false, error: "Email is already in use" };
        }
      }
    }

    if (updates.username !== this.currentUser.username) {
      for (const user of this.users.values()) {
        if (
          user.username.toLowerCase() === updates.username.toLowerCase() &&
          user.email !== this.currentUser.email
        ) {
          return { success: false, error: "Username is already taken" };
        }
      }
    }

    const oldEmail = this.currentUser.email;
    const storedUser = this.users.get(oldEmail);

    if (storedUser) {
      if (oldEmail !== updates.email) {
        this.users.delete(oldEmail);
      }

      this.users.set(updates.email, {
        ...storedUser,
        email: updates.email,
        phoneNumber: updates.phoneNumber,
        username: updates.username,
      });

      this.currentUser = {
        ...this.currentUser,
        email: updates.email,
        phoneNumber: updates.phoneNumber,
        username: updates.username,
      };

      localStorage.setItem("cityfix_user", JSON.stringify(this.currentUser));
      this.notify();
    }

    return { success: true };
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): { success: boolean; error?: string } {
    if (!this.currentUser) {
      return { success: false, error: "Not logged in" };
    }

    const user = this.users.get(this.currentUser.email);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" };
    }

    this.users.set(this.currentUser.email, {
      ...user,
      password: newPassword,
    });

    return { success: true };
  }
}

export const authStore = new AuthStore();
