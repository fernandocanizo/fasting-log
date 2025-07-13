#!/usr/bin/env -S deno run --allow-read

import * as bcrypt from "bcrypt"

const promptForPassword = (): string => {
  const password = prompt("Enter password to hash:")
  if (!password || password.trim() === "") {
    console.error("❌ Password cannot be empty")
    Deno.exit(1)
  }
  return password.trim()
}

const promptForConfirmation = (password: string): void => {
  const confirmation = prompt("Confirm password:")
  if (confirmation !== password) {
    console.error("❌ Passwords do not match")
    Deno.exit(1)
  }
}

const main = async (): Promise<void> => {
  console.log("🔐 Password Hashing Utility")
  console.log("This utility creates a secure bcrypt hash of your password.")
  console.log("⚠️  The password will not be visible while typing.\n")

  try {
    const password = promptForPassword()
    promptForConfirmation(password)

    console.log("\n🔄 Generating secure hash...")

    // Use bcrypt with salt rounds of 12 for strong security
    const saltRounds = "12"
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log("\n✅ Password hashed successfully!")
    console.log("🔑 Hash:")
    console.log(hashedPassword)
    console.log(
      "\n📋 Copy this hash and paste it as the LOGIN_PASSWORD value in your .env file",
    )
    console.log(
      "⚠️  Make sure to remove any plain text passwords from your .env file!",
    )
  } catch (error) {
    console.error(
      "❌ Error generating hash:",
      error instanceof Error ? error.message : String(error),
    )
    Deno.exit(1)
  }
}

// Utility function for verifying passwords (exported for use in main app)
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

// Run main function if this script is executed directly
if (import.meta.main) {
  await main()
}
