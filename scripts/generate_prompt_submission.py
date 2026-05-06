"""One-off generator: Cursor transcripts -> PROMPTS_SUBMISSION.md (run from repo root)."""

from __future__ import annotations

import glob
import json
import os
import re


def refine_prompt(_uid: str, _idx: int, body: str) -> str:
    b = body.lower().strip()
    first_line = body.split("\n", 1)[0][:160]
    rules: list[tuple[bool, str]] = [
        (
            "create a md file" in b and "every prompt" in b,
            "Maintain a single Markdown audit trail of all prompts, grouped by chat, for submission evidence and traceability.",
        ),
        (
            "another commit" in b and "branch" in b and "commit message" in b,
            "Request a conventional branch name and commit message appropriate for the staged changes.",
        ),
        (
            "cz commit" in b and "view balance" in b,
            "Use Commitizen for this commit; scope the message to include both the Sepolia balance work and any documentation updates.",
        ),
        (
            "valid branch name" in b and "content" in b,
            "Provide a git-valid branch name that reflects the combined documentation and frontend balance updates.",
        ),
        (
            "follow the rubric" in b and "maximise" in b,
            "Expand the prompt log to align with the module rubric, tightening wording so oversight (wallet security, roles, contract, tests, CI) is explicit for markers.",
        ),
        (
            "build out the folder and file structure" in b,
            "Scaffold contracts (Hardhat), deploy scripts, tests, and frontend (pages, assets) with placeholders only until implementation begins.",
        ),
        (
            "very basic html" in b and "wallet" in b,
            "Implement the wallet page with client-side generation, on-screen details, and JSON download—then review implications of displaying sensitive material.",
        ),
        (
            "ethers.umd" in b or ("use strict" in b and "wallet" in b),
            "Clarify how the CDN bundle, strict mode, and `Wallet.createRandom()` fit the architecture.",
        ),
        (
            "ethers loaded in html" in b or ("why is eithers" in b),
            "Explain why ethers is loaded via an HTML `<script>` tag in a static, no-bundler setup.",
        ),
        (
            "boiler plate for every html page" in b or ("sidebar" in b and "hamburger" in b),
            "Apply a consistent shell across pages: central navigation, left sidebar, and hamburger toggle per layout spec.",
        ),
        (
            "hamburger" in b and "outside" in b and "sidebar" in b,
            "Adjust CSS so the toggle sits outside the sidebar edge and is centred in its control.",
        ),
        (
            "margin on the right of the hamburger" in b,
            "Fine-tune spacing and vertical alignment of the sidebar toggle relative to the Home link.",
        ),
        (
            "ui unit tests" in b and "github actions" in b,
            "Add frontend unit tests and document GitHub Actions running them on pull requests.",
        ),
        (
            "branch name and commit message" in b and "comiizen" in b,
            "Suggest branch and commit text compatible with Commitizen and semantic versioning.",
        ),
        (
            "install comitizen" in b and "semantic version" in b,
            "Clarify Commitizen versus release/version-bump tooling and what belongs in PR CI versus release.",
        ),
        (
            "dont want to install comitizen" in b and "uv" in b,
            "Manage dev tools via `uv` dependency groups and document runtime vs dev installs in the README.",
        ),
        (
            "pyproject.toml is for python" in b,
            "Explain Python versus JavaScript package manifests in a polyglot repository.",
        ),
        (
            "gitignore for node modules" in b,
            "Exclude `node_modules` and common local artefacts from version control before committing.",
        ),
        (
            "alternatives" in b and "uv" in b and "install" in b and "right option" in b,
            "Evaluate `uv` against alternatives and provide the official install command.",
        ),
        (
            "uv --version" in b and "not recognized" in b,
            "Diagnose PATH after installing `uv` on Windows PowerShell.",
        ),
        (
            "uv lock" in b and "git ignore" in b,
            "Confirm lockfile policy: commit `uv.lock` for reproducible installs.",
        ),
        (
            "final branch name and commit message" in b,
            "Provide ready-to-use branch and commit strings before pushing.",
        ),
        (
            "configure my github actions" in b,
            "Explain how workflow YAML under `.github/workflows` configures CI triggers and jobs.",
        ),
        (
            "backend in my file structure" in b,
            "Clarify that Solidity and Hardhat tooling can live at repo root (or a `contracts/` folder) without a traditional API server.",
        ),
        (
            "balances page" in b and "sepolia" in b and "address" in b,
            "Implement read-only Sepolia ETH (and later token) lookup by wallet address on the balances page.",
        ),
        (
            "init this folder in my repo" in b,
            "Initialize git, add the GitHub remote, and create the first commit with the specified message.",
        ),
        (
            "dont say made with cursor" in b,
            "Ensure commit metadata contains only the student-authored message.",
        ),
        (
            "fully implement the js" in b and "buy-ticket" in b,
            "Complete buy-ticket JavaScript: wallet connection, Sepolia checks, ETH and token balances, and flows for attendee, doorman, and venue use cases.",
        ),
        (
            "linking in back to sepolia" in b or "workflow look like" in b,
            "Request an end-to-end narrative from wallet creation to a funded Sepolia wallet and on-chain interactions.",
        ),
        (
            "put that wallet on to the sepolia network" in b or "put that wallet on" in b,
            "Define onboarding: import into MetaMask, select Sepolia, fund via faucet, verify on an explorer.",
        ),
        (
            "wallets dont actually exist" in b and "metamask" in b,
            "Clarify address validity versus on-chain activity and how MetaMask and JSON-RPC fit together.",
        ),
        (
            "no wallet extension detected" in b,
            "Debug missing `window.ethereum` (serving over HTTP vs `file://`, browser, extensions).",
        ),
        (
            "plan out the next steps" in b and "contract" in b,
            "Plan QoL, formatting, and a maintainable contract-driven buy/refund architecture.",
        ),
        (
            "feel free to delete" in b and "backend or frontend" in b,
            "Align implementation with the full brief and remove unused scaffolding once replacements exist.",
        ),
        (
            body.strip() == "implement the plan",
            "Execute the agreed plan: ERC-20 with payable purchase, frontend wiring, deployment artefacts, and CI updates.",
        ),
        (
            "what does prettier do" in b and "prettier" in b,
            "Explain Prettier versus linters, summarise contract purchase behaviour, and interpret the Sepolia network check error.",
        ),
        (
            "cant find a sepolia address" in b,
            "Clarify that wallet addresses are shared across networks while balances are network-specific.",
        ),
        (
            "changes made since last commit" in b and "cz commit" in b,
            "Summarise changes since the last commit; propose a branch name and Commitizen steps for a PR.",
        ),
    ]
    for cond, text in rules:
        if cond:
            return text
    tail = "…" if len(body) > 220 else ""
    return f"Restated for assessment: {first_line}{tail}"


def main() -> None:
    transcript_glob = os.path.join(
        os.path.expanduser("~"),
        ".cursor",
        "projects",
        "c-Users-eoino-Year2-Blockchain",
        "agent-transcripts",
        "*",
        "*.jsonl",
    )
    files = sorted(glob.glob(transcript_glob))
    by_uid: dict[str, list[dict]] = {}
    for path in files:
        uid = os.path.basename(path).replace(".jsonl", "")
        prompts: list[dict] = []
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                obj = json.loads(line)
                if obj.get("role") != "user":
                    continue
                content = obj.get("message", {}).get("content", [])
                raw = "\n".join(x.get("text", "") for x in content if x.get("type") == "text").strip()
                ts_m = re.search(r"<timestamp>([^<]+)</timestamp>", raw)
                um = re.search(r"<user_query>\n?(.*?)\n?</user_query>", raw, re.S)
                body = (um.group(1).strip() if um else re.sub(r"<timestamp>[^<]+</timestamp>", "", raw).strip())
                prompts.append({"ts": ts_m.group(1).strip() if ts_m else None, "body": body})
        by_uid[uid] = prompts

    chat_titles = {
        "02c72c07-e536-434f-9dd6-4b734d2660d9": "Prompt log, commits & rubric",
        "16c5b5f1-e618-4177-9680-e5549ade6ef5": "Scaffold, wallet UI, tests & tooling",
        "33610894-fc87-4999-aa04-ef6e500455c3": "Sepolia balances page",
        "4f8e4297-343d-4eee-a0ad-5fe1e661c33a": "Plan & implement TicketToken DApp",
        "ced3ddb1-9e63-4669-9033-39341d77395f": "Git init & first push",
        "d232ccf7-586f-4932-bb51-e320e70ab100": "Buy-ticket JS & Sepolia workflow",
    }

    rubric_rows = [
        "| **1. Process oversight & traceability** | Branch/commit conventions, Commitizen, GitHub Actions, `uv` tooling | `02c72c07`, `16c5b5f1`, `ced3ddb1` |",
        "| **2.1 Wallet creation** | Generate, display, download; understanding of ethers / strict mode | `16c5b5f1` |",
        "| **2.2 Balance checks (actor roles)** | One UI: arbitrary address for attendee / doorman / venue | `16c5b5f1`, `33610894`, `d232ccf7` |",
        "| **2.3–2.4 Purchase & return** | Buy flow, contract alignment, transfer back to vendor | `d232ccf7`, `4f8e4297` |",
        "| **3.1 Smart contract** | ERC-20 + native ETH purchase; Hardhat, tests, deploy | `4f8e4297`, `16c5b5f1` |",
        "| **3.2–3.3 Structure & report support** | Repo layout; evidence (explorer links) implied by workflow prompts | `16c5b5f1`, `4f8e4297` |",
        "| **4. Testing & QA** | Vitest UI tests + CI; Hardhat tests; error-handling/debug prompts | `16c5b5f1`, `4f8e4297`, `d232ccf7` |",
    ]

    preferred = [
        "ced3ddb1-9e63-4669-9033-39341d77395f",
        "16c5b5f1-e618-4177-9680-e5549ade6ef5",
        "d232ccf7-586f-4932-bb51-e320e70ab100",
        "33610894-fc87-4999-aa04-ef6e500455c3",
        "4f8e4297-343d-4eee-a0ad-5fe1e661c33a",
        "02c72c07-e536-434f-9dd6-4b734d2660d9",
    ]
    uids = [u for u in preferred if u in by_uid] + [u for u in by_uid if u not in preferred]

    lines: list[str] = []
    lines.append("# Prompt submission log (AI use — managerial assessment)")
    lines.append("")
    lines.append(
        "This file lists **verbatim** user prompts from Cursor chat transcripts for this project, grouped by chat. "
        "Each prompt includes a **short reframing**—the same intent in clearer *managerial oversight* language for markers "
        "(aligned with **Students as Managers of AI**). It does **not** replace your written report or peer-review reflection."
    )
    lines.append("")
    lines.append("## How this maps to the managerial rubric (quick index)")
    lines.append("")
    lines.append("| Criterion (summary) | What to point to in this log | Example chat IDs |")
    lines.append("| --- | --- | --- |")
    lines.extend(rubric_rows)
    lines.append("")
    lines.append(
        "*Peer review (10%):* submit your 200-word reflection separately; use this log only as evidence of AI dialogue traceability."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    total = 0
    for uid in uids:
        prompts = by_uid[uid]
        total += len(prompts)
        title = chat_titles.get(uid, "Chat session")
        lines.append(f"## Chat: [{title}]({uid})")
        lines.append("")
        for i, p in enumerate(prompts, 1):
            lines.append(f"### Prompt {i}")
            lines.append("")
            if p["ts"]:
                lines.append(f"*Timestamp:* {p['ts']}")
                lines.append("")
            lines.append("**Verbatim**")
            lines.append("")
            for pl in p["body"].splitlines():
                lines.append(f"> {pl}")
            lines.append("")
            ref = refine_prompt(uid, i, p["body"])
            lines.append("**Reframed for assessment (same intent)**")
            lines.append("")
            lines.append(f"> {ref}")
            lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(f"*Total prompts: **{total}**. Transcript source: `.cursor/projects/.../agent-transcripts`.*")

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(repo_root, "PROMPTS_SUBMISSION.md")
    with open(out_path, "w", encoding="utf-8") as w:
        w.write("\n".join(lines))
    print(f"Wrote {out_path} ({total} prompts)")


if __name__ == "__main__":
    main()
