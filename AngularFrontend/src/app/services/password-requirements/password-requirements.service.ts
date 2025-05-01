// Shane Petree
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordRequirementsService {
  private min_length: number;
  // change this to false to disable password requirements checking
  private isEnabled: boolean = true;

  constructor() {
    // change the minimum length of the password here
    this.setPasswordMinLength(8);
  }

  private setPasswordMinLength(length: number): void {
    if (length < 1) {
      throw new Error("Password length must be at least 1.");
    }
    this.min_length = length;
  }

  // using regular expressions: checks if a password has uppercase, lowercase, numbers, special characters, and is at least {password_length} chars long
  private checkRequirements(password: string): boolean {
    const minLengthRegex = new RegExp(`.{${this.min_length},}`);
    const hasUppercase = /.*[A-Z]/;
    const hasLowercase = /.*[a-z]/;
    const hasDigit = /.*\d/;
    const hasSpecialChar = /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return (
      minLengthRegex.test(password) &&
      hasUppercase.test(password) &&
      hasLowercase.test(password) &&
      hasDigit.test(password) &&
      hasSpecialChar.test(password)
    );
  }

  validatePassword(password: string): boolean {
    // if the password checking is enabled
    if (this.isEnabled) {
      const isPasswordValid: boolean = this.checkRequirements(password);

      //! TEST PRINT
      //console.log(`Valid: ${isPasswordValid}`);

      return (isPasswordValid);
    }
    // just return true if not checking password
    else {
      return true;
    }
  }

  getMinPasswordLength(): number {
    return this.min_length;
  }

  isActive(): boolean {
    return this.isEnabled;
  }
}
