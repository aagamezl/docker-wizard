# Docker `COPY` Command Analysis & Wizard Implementation Guide

## Executive Summary
The original `COPY` command contains critical incompatibilities. The `--link` option cannot be used with `--chown` or `--chmod`. Additionally, Labs features (`--parents`, `--exclude`) should be avoided for a general-purpose wizard. This document provides a breakdown of the issues and a recommended implementation strategy.

---

## Error Breakdown & Fixes

### Critical Error: Incompatible Flags
**Problem:** The `--link` flag is fundamentally incompatible with `--chown` and `--chmod`.
- `--link`: Creates hard links for build cache optimization (requires no file modification)
- `--chown`/`--chmod`: Requires modifying file metadata (ownership & permissions)
- **These purposes are mutually exclusive.**

**Fix:** The user must choose one of two mutually exclusive modes:
1.  **Permission Control Mode:** Use `--chown` and/or `--chmod` (remove `--link`)
2.  **Build Optimization Mode:** Use `--link` (remove `--chown` and `--chmod`)

### Invalid Command Examples:
```dockerfile
# ❌ INVALID: --link cannot be combined with --chown/--chmod
COPY --chown=docker:docker --chmod=644 --link hom* /app/
```

### Valid Command Examples:
```dockerfile
# ✅ VALID: Permission Control Mode
COPY --chown=docker:docker --chmod=644 hom* /app/

# ✅ VALID: Build Optimization Mode
COPY --link hom* /app/
```

### Labs Feature Advisory
**Problem:** Features like `--parents` and `--exclude` are only available in Docker Engine's "Labs" channel (version `1.7-labs`). Most users run the stable release, which will fail to build a Dockerfile using these flags.

**Recommendation:** Omit `--parents` and `--exclude` from the initial wizard implementation to ensure maximum compatibility and prevent user build errors.

---

## Recommendation for Wizard Logic

Implement a UI/flow that guides the user to a valid configuration by making mutually exclusive choices clear.

### Proposed Wizard Flow:

#### Step 1: Source & Destination
User defines the source files/folders (e.g., `hom*`) and the destination path (e.g., `/app/`).

#### Step 2: Copy Mode Selection (Radio Button Group)
Present the user with a clear, mutually exclusive choice.

**Option A: "Set File Permissions" (Default)**
- **Description:** "Set specific ownership and permissions for the copied files."
- **Action:** Selecting this enables the permission inputs and disables (greys out) the `--link` option.
- **UI Controls to Enable:**
    - `--chown` **Text Input:** Pre-populated with `docker:docker` as an example. Clear placeholder text is recommended (e.g., "user:group").
    - `--chmod` **Text Input:** Pre-populated with `644`. A dropdown with common permissions (e.g., `644`, `755`, `777`) could be helpful.

**Option B: "Optimize for Build Speed (--link)"**
- **Description:** "Use build cache optimization for faster builds. Cannot set permissions."
- **Action:** Selecting this disables (greys out) the `--chown` and `--chmod` inputs.

#### Step 3: Command Preview
Dynamically generate a preview of the valid Dockerfile command based on the user's selections.

**Example Previews:**
- **For Permission Mode:** `COPY --chown=myuser:mygroup --chmod=755 hom* /app/`
- **For Link Mode:** `COPY --link hom* /app/`

---

## Final Implementation Code (Pseudocode Logic)

```python
# Pseudo-code for the wizard's decision logic
def generate_copy_command(source, destination, copy_mode, chown_value=None, chmod_value=None):
    flags = []

    if copy_mode == "permission_mode":
        if chown_value:
            flags.append(f"--chown={chown_value}")
        if chmod_value:
            flags.append(f"--chmod={chmod_value}")
    elif copy_mode == "link_mode":
        flags.append("--link")

    # Join all flags into a single string
    flags_str = " ".join(flags)

    # Construct the final command
    command = f"COPY {flags_str} {source} {destination}"
    return command.strip()

# Example usage
command = generate_copy_command(
    source="hom*",
    destination="/app/",
    copy_mode="permission_mode", # or "link_mode"
    chown_value="docker:docker",
    chmod_value="644"
)
print(command) # OUTPUT: COPY --chown=docker:docker --chmod=644 hom* /app/
```