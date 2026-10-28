# Landing Page Reference

Source:
- Installed Codex skill: `unicorn-landing`
- Original: https://github.com/peth-eth/unicorn-landing/blob/main/SKILL.md

Use this reference whenever we build, audit, or revise a landing page, hero section, CTA flow, or marketing page.

## Core Rule

A strong landing page answers one question first: "Am I in the right place?"

The first viewport should be simple, specific, and conversion-aware. The product should be visible early. The primary action should be low-friction.

## 11 Patterns

1. Category-defining headline
   - Own a category, not a feature list.
   - Test: replace our name with a competitor. If the line still works, it is too generic.

2. Hero simplicity
   - Keep the hero under 30 words total where possible.
   - Use one headline, one subline, one primary CTA.

3. Two-sided split when needed
   - Only for marketplace or dual-audience products.
   - Both audiences should find their path within 3 seconds.

4. Product in the hero
   - Show the real product, interface, workflow, data, or interaction.
   - Avoid abstract illustrations as the main proof.

5. Social proof through scale
   - Use the biggest true proof number we have.
   - A specific smaller number beats a vague large claim.

6. Minimal navigation
   - Keep primary nav to 5 or 6 items maximum.
   - Every extra item adds friction.

7. Personalization by audience
   - Useful after the first six patterns are strong.
   - Can use role selectors, URL params, referrers, or explicit segment choices.

8. Free primary CTA
   - Lead with self-serve: "Get started", "Try free", "Start building".
   - Sales CTAs can exist, but should not usually be the primary hero CTA.

9. Invisible page speed
   - Target LCP under 2.5s and CLS under 0.1.
   - Optimize hero media and avoid heavy blocking scripts.

10. Footer as navigation hub
   - Early stage: simple 3-column footer.
   - Mature product: clear sitemap by Product, Developers, Company, Legal.

11. Cross-page consistency
   - Same type scale, color tokens, spacing, buttons, and component behavior across pages.
   - The page should feel like Fluso even before the logo appears.

## Fluso-Specific Application

- Use the visual identity system as the page's foundation: monochrome canvas, Helvetica-style type, modular dot language, natural/dither texture.
- The hero should not feel like a generic AI landing page. Use a literal product/category claim.
- Show product UI, a real workflow, or a credible interactive surface in the first viewport.
- Keep texture atmospheric, not decorative. It should support the product claim.
- Use one dominant accent family per page or section: Studio sage, Chat clay, API blue-grey, or a texture-derived accent.

## Landing Page Audit Format

Use this table when reviewing a page:

| Pattern | Score | Note |
| --- | --- | --- |
| Category headline | PASS / PARTIAL / FAIL | Does the headline own a category? |
| Hero simplicity | PASS / PARTIAL / FAIL | Word count and clarity. |
| Two-sided split | N/A / PASS / FAIL | Only if relevant. |
| Product in hero | PASS / PARTIAL / FAIL | What product proof is visible? |
| Social proof | PASS / PARTIAL / FAIL | Biggest true number used. |
| Minimal nav | PASS / PARTIAL / FAIL | Current item count. |
| Personalization | PASS / PARTIAL / FAIL | Segment-specific path exists? |
| Free CTA | PASS / PARTIAL / FAIL | Primary CTA text. |
| Page speed | PASS / PARTIAL / FAIL | LCP and CLS if known. |
| Footer depth | PASS / PARTIAL / FAIL | Footer structure. |
| Consistency | PASS / PARTIAL / FAIL | Matches visual system? |

## Build Spec Format

Use this when creating a landing page from scratch:

- Category claim:
- Subheadline, max 15 words:
- Hero word count:
- Primary CTA:
- Product visual:
- Biggest proof number:
- Nav items, max 6:
- Audience split needed:
- Social proof section:
- Footer structure:
