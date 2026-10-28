import { memo, useRef, useEffect, useCallback } from "react"
import { cn } from "@/utils/styles"
import { PREM_LOGO_PATHS, PREM_DOTS } from "@/components/icons/static/prem-logo-data"

const MAX_DIST = 145.1
const NS = "http://www.w3.org/2000/svg"

export type AnimMode = "ripple" | "spiral" | "wave" | "vortex" | "scatter" | "pulse" | "orbit" | "galaxy" | "smile" | "prem"
const MODES: AnimMode[] = [
    "ripple",
    "vortex",

    "galaxy",
    "wave",
    "smile",
    "spiral",
    "scatter",
    "pulse",

    "orbit"
]
export type ThinkingType = AnimMode | "random"
const MODE_DURATION = 8000
const TRANSITION_MS = 1000
const ENTRANCE_DURATION = 1500

// Entrance tuning. Stagger spreads the reveal from centre (0) to the outermost
// petals across REVEAL_STAGGER; each dot then resolves over REVEAL_DUR. GATHER
// is how far (as a fraction of its offset from centre) a dot starts pushed out
// before drifting home. Kept short so the mark reads as moving the instant it
// appears — no near-empty lead-in before the bloom becomes visible.
const REVEAL_STAGGER = 600
const REVEAL_DUR = 600
const GATHER_AMOUNT = 0.14

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Snappy attack with a long, soft settle — reads as "arriving" rather than
// "creeping in". Used for the entrance fade + inward gather.
function easeOutExpo(t: number) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// Gentle overshoot that lands exactly on 1, so the dots settle into place with
// a hair of life instead of snapping to a dead stop. c1 kept low (subtle).
function easeOutBackSoft(t: number) {
    const c1 = 1.18
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const CENTER_X = 156.6
const CENTER_Y = 161.8

const SMILE_TARGETS: ReadonlyArray<[number, number]> = (() => {
    const targets: [number, number][] = new Array(56)
    const cx = 156, cy = 162

    targets[0] = [108, 112]
    targets[1] = [122, 112]

    targets[2] = [190, 112]
    targets[3] = [204, 112]

    targets[4] = [150, 156]
    targets[5] = [162, 156]

    for (let j = 0; j < 16; j++) {
        const p = j / 15
        targets[6 + j] = [75 + p * 162, 210 + Math.sin(p * Math.PI) * 50]
    }

    for (let j = 0; j < 34; j++) {
        const a = (j / 34) * Math.PI * 2
        targets[22 + j] = [cx + 125 * Math.cos(a), cy + 125 * Math.sin(a)]
    }

    return targets
})()

const PREM_TEXT_TARGETS: ReadonlyArray<[number, number]> = (() => {
    const positions: [number, number][] = []
    const cw = 12, rh = 22, yBase = 107
    const add = (xBase: number, grid: [number, number][]) => {
        for (const [c, r] of grid) positions.push([xBase + c * cw, yBase + r * rh])
    }

    add(19, [
        [0,0],[1,0],[2,0],[3,0],
        [0,1],[3,1],
        [0,2],[3,2],
        [0,3],[1,3],[2,3],
        [0,4],[0,5]
    ])

    add(95, [
        [0,0],[1,0],[2,0],
        [0,1],[3,1],
        [0,2],[1,2],[2,2],
        [0,3],[1,3],
        [0,4],[2,4],
        [0,5],[3,5]
    ])

    add(171, [
        [0,0],[1,0],[2,0],[3,0],
        [0,1],
        [0,2],[1,2],[2,2],
        [0,3],
        [0,4],
        [0,5],[1,5],[2,5],[3,5]
    ])

    add(247, [
        [0,0],[4,0],
        [0,1],[1,1],[3,1],[4,1],
        [0,2],[2,2],[4,2],
        [0,3],[4,3],
        [0,4],[4,4],
        [0,5],[4,5]
    ])

    return positions
})()

function getFormationProgress(i: number, t: number): number {
    const n = PREM_LOGO_PATHS.length
    const stagger = (i / n) * 1500
    const dotT = Math.max(0, t - stagger)
    const raw = Math.min(1, dotT / 2500)
    return easeInOutCubic(raw)
}

function getOpacity(mode: AnimMode, i: number, t: number): number {
    const dot = PREM_DOTS[i]
    const normDist = dot.dist / MAX_DIST

    switch (mode) {
        case "ripple": {
            const wave = Math.sin(t * 0.003 - normDist * Math.PI * 3)
            return 0.3 + 0.7 * (wave * 0.5 + 0.5)
        }
        case "spiral": {
            const phase = dot.angle + normDist * Math.PI * 2
            const wave = Math.sin(t * 0.002 - phase)
            return 0.15 + 0.85 * (wave * 0.5 + 0.5)
        }

        case "wave": {
            const normX = (dot.cx - 13) / (300 - 13)
            const wave = Math.sin(t * 0.003 - normX * Math.PI * 2.5)
            return 0.15 + 0.85 * (wave * 0.5 + 0.5)
        }
        case "vortex": {
            const phase = dot.angle * 2 + normDist * Math.PI * 4
            const wave = Math.sin(t * 0.0015 - phase)
            return 0.2 + 0.8 * (wave * 0.5 + 0.5)
        }
        case "scatter": {
            const seed = (i * 137.508) % 1
            const wave = Math.sin(t * 0.002 + seed * Math.PI * 6)
            return 0.1 + 0.9 * Math.max(0, wave * 0.5 + 0.5)
        }
        case "pulse": {
            const ring = Math.floor(normDist * 5)
            const wave = Math.sin(t * 0.003 - ring * 1.2)
            return 0.15 + 0.85 * (wave * 0.5 + 0.5)
        }
        case "orbit": {
            return 0.6 + 0.4 * Math.sin(t * 0.002 + i * 0.3)
        }
        case "galaxy": {

            const armPhase = dot.angle * 3 + normDist * Math.PI * 5
            const twinkle = Math.sin(t * 0.004 - armPhase) * Math.sin(t * 0.0017 + i * 0.7)
            return 0.15 + 0.85 * (twinkle * 0.5 + 0.5)
        }
        case "smile": {
            const p = getFormationProgress(i, t)
            const base = 0.3 + 0.7 * p
            const breath = Math.max(0, p - 0.8) / 0.2
            return Math.min(1, base + breath * Math.sin(t * 0.003 + i * 0.4) * 0.15)
        }
        case "prem": {
            const p = getFormationProgress(i, t)
            return 0.3 + 0.7 * p
        }
    }
}

function getScale(mode: AnimMode, i: number, t: number): number {
    const dot = PREM_DOTS[i]
    const normDist = dot.dist / MAX_DIST

    switch (mode) {
        case "ripple": {
            const wave = Math.sin(t * 0.003 - normDist * Math.PI * 3)
            return 0.85 + 0.15 * (wave * 0.5 + 0.5)
        }
        case "spiral": {
            const phase = dot.angle + normDist * Math.PI * 2
            const wave = Math.sin(t * 0.002 - phase)
            return 0.8 + 0.2 * (wave * 0.5 + 0.5)
        }

        case "wave": {
            const normX = (dot.cx - 13) / (300 - 13)
            const wave = Math.sin(t * 0.003 - normX * Math.PI * 2.5)
            return 0.85 + 0.15 * (wave * 0.5 + 0.5)
        }
        case "vortex": {
            const phase = dot.angle * 2 + normDist * Math.PI * 4
            const wave = Math.sin(t * 0.0015 - phase)
            return 0.6 + 0.4 * (wave * 0.5 + 0.5)
        }
        case "scatter": {
            const seed = (i * 137.508) % 1
            const wave = Math.sin(t * 0.0025 + seed * Math.PI * 4)
            return 0.5 + 0.8 * (wave * 0.5 + 0.5)
        }
        case "pulse": {
            const ring = Math.floor(normDist * 5)
            const wave = Math.sin(t * 0.003 - ring * 1.2)
            return 0.5 + 0.5 * (wave * 0.5 + 0.5)
        }
        case "orbit": {
            return 0.8 + 0.2 * Math.sin(t * 0.003 + i * 0.5)
        }
        case "galaxy": {
            const armPhase = dot.angle * 3 + normDist * Math.PI * 5
            const twinkle = Math.sin(t * 0.004 - armPhase)
            return 0.6 + 0.4 * (twinkle * 0.5 + 0.5)
        }
        case "smile": {
            const p = getFormationProgress(i, t)
            const nd = dot.dist / MAX_DIST
            const targetScale = 0.5 - nd * 0.2
            const s = 1.0 + (targetScale - 1.0) * p
            const breath = Math.max(0, p - 0.8) / 0.2
            return s + breath * Math.sin(t * 0.003 + i * 0.5) * 0.02
        }
        case "prem": {
            const p = getFormationProgress(i, t)
            const nd = dot.dist / MAX_DIST

            const targetScale = 0.3 - nd * 0.12
            return 1.0 + (targetScale - 1.0) * p
        }
    }
}

function getTranslate(mode: AnimMode, i: number, t: number): [number, number] {
    const dot = PREM_DOTS[i]
    const normDist = dot.dist / MAX_DIST
    const dx = dot.cx - CENTER_X
    const dy = dot.cy - CENTER_Y

    switch (mode) {
        case "vortex": {

            const speed = 0.001 * (1 + normDist * 0.5)
            const a = t * speed
            const r = normDist * 8
            return [Math.cos(a + dot.angle) * r, Math.sin(a + dot.angle) * r]
        }
        case "scatter": {

            const seed = (i * 137.508) % 1
            const phase = Math.sin(t * 0.001 + seed * Math.PI * 2)
            const strength = 12 + seed * 15
            const angle = dot.angle + seed * 0.5
            return [Math.cos(angle) * phase * strength, Math.sin(angle) * phase * strength]
        }
        case "pulse": {

            const ring = Math.floor(normDist * 5)
            const wave = Math.sin(t * 0.003 - ring * 1.2)
            const push = wave * 6 * normDist
            const len = Math.max(0.01, Math.sqrt(dx * dx + dy * dy))
            return [(dx / len) * push, (dy / len) * push]
        }
        case "orbit": {

            const speed = 0.002
            const radius = 4 + normDist * 6
            const phase = dot.angle + i * 0.4
            return [Math.cos(t * speed + phase) * radius, Math.sin(t * speed + phase) * radius]
        }
        case "galaxy": {

            const speed = 0.0015 / (0.3 + normDist * 0.7)
            const angle = t * speed + dot.angle
            const wobble = Math.sin(t * 0.002 + i) * 3
            const r = 10 + normDist * 12 + wobble
            return [Math.cos(angle) * r - Math.cos(dot.angle) * r, Math.sin(angle) * r - Math.sin(dot.angle) * r]
        }
        case "smile": {
            const p = getFormationProgress(i, t)
            const [tx, ty] = SMILE_TARGETS[i]
            const baseX = (tx - dot.cx) * p
            const baseY = (ty - dot.cy) * p
            const breath = Math.max(0, p - 0.8) / 0.2
            const wobbleX = breath * Math.sin(t * 0.002 + i * 0.5) * 3
            const wobbleY = breath * Math.cos(t * 0.0025 + i * 0.7) * 2
            return [baseX + wobbleX, baseY + wobbleY]
        }
        case "prem": {
            const p = getFormationProgress(i, t)
            const [tx, ty] = PREM_TEXT_TARGETS[i]

            return [(tx - dot.cx) * p, (ty - dot.cy) * p]
        }
        default:
            return [0, 0]
    }
}

export const PremLogoThinking = memo(({ width = 20, height = 20, once = false, animate = true, skipEntrance = false, type = "random" }: { width?: number | string; height?: number | string; once?: boolean; animate?: boolean; skipEntrance?: boolean; type?: ThinkingType }) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const pathElsRef = useRef<SVGPathElement[]>([])
    const rafRef = useRef<number>(0)
    const animateRef = useRef(animate)
    const hasEnteredRef = useRef(false)

    const settlingRef = useRef(false)
    const settleStartRef = useRef(0)
    const settleSnapOpacity = useRef<Float32Array | null>(null)
    const settleSnapScale = useRef<Float32Array | null>(null)
    const settleSnapTx = useRef<Float32Array | null>(null)
    const settleSnapTy = useRef<Float32Array | null>(null)
    const prevAnimateRef = useRef(animate)

    animateRef.current = animate

    const setupPaths = useCallback((svg: SVGSVGElement) => {
        if (pathElsRef.current.length > 0) return
        const els: SVGPathElement[] = []
        for (let i = 0; i < PREM_LOGO_PATHS.length; i++) {
            const el = document.createElementNS(NS, "path")
            el.setAttribute("d", PREM_LOGO_PATHS[i])
            el.style.fill = "currentColor"
            el.style.opacity = (animate && !skipEntrance) ? "0" : "1"
            el.style.transform = "scale(1)"
            el.style.transformOrigin = `${PREM_DOTS[i].cx}px ${PREM_DOTS[i].cy}px`
            svg.appendChild(el)
            els.push(el)
        }
        pathElsRef.current = els
        if (!animate || skipEntrance) hasEnteredRef.current = true
    }, [])

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        setupPaths(svg)
        const pathEls = pathElsRef.current

        function pickNextMode(currentIdx: number): [AnimMode, number] {
            if (type !== "random") return [type, -1]

            const weights = MODES.map(m => m === "smile" ? 0.2 : 1.0)
            let next = currentIdx
            while (next === currentIdx && MODES.length > 1) {
                const totalWeight = weights.reduce((a, b) => a + b, 0)
                let r = Math.random() * totalWeight
                for (let i = 0; i < weights.length; i++) {
                    r -= weights[i]
                    if (r <= 0) { next = i; break }
                }
            }
            return [MODES[next], next]
        }

        let entranceDone = hasEnteredRef.current
        const [initMode, initIdx] = pickNextMode(-1)
        let mode: AnimMode = initMode
        let prevMode: AnimMode = initMode
        let modeIdx = initIdx
        let modeTime = 0

        const snapOpacity = new Float32Array(PREM_LOGO_PATHS.length).fill(1)
        const snapScale = new Float32Array(PREM_LOGO_PATHS.length).fill(1)
        const snapTx = new Float32Array(PREM_LOGO_PATHS.length).fill(0)
        const snapTy = new Float32Array(PREM_LOGO_PATHS.length).fill(0)
        const startTime = performance.now()

        const SETTLE_MS = 600

        function loop(now: number) {

            if (prevAnimateRef.current && !animateRef.current && !settlingRef.current) {
                settlingRef.current = true
                settleStartRef.current = now
                const n = pathEls.length
                const sO = new Float32Array(n), sS = new Float32Array(n)
                const sTx = new Float32Array(n), sTy = new Float32Array(n)
                for (let i = 0; i < n; i++) {

                    const style = pathEls[i].style
                    sO[i] = parseFloat(style.opacity) || 1
                    const m = style.transform.match(/translate\(([-\d.]+)px[, ]+([-\d.]+)px\)\s*scale\(([-\d.]+)\)/)
                    if (m) { sTx[i] = parseFloat(m[1]); sTy[i] = parseFloat(m[2]); sS[i] = parseFloat(m[3]) }
                    else {
                        const sm = style.transform.match(/scale\(([-\d.]+)\)/)
                        sS[i] = sm ? parseFloat(sm[1]) : 1; sTx[i] = 0; sTy[i] = 0
                    }
                }
                settleSnapOpacity.current = sO
                settleSnapScale.current = sS
                settleSnapTx.current = sTx
                settleSnapTy.current = sTy
            }
            prevAnimateRef.current = animateRef.current

            if (settlingRef.current) {
                const elapsed = now - settleStartRef.current
                const progress = Math.min(1, elapsed / SETTLE_MS)
                const eased = easeInOutCubic(progress)
                const sO = settleSnapOpacity.current!, sS = settleSnapScale.current!
                const sTx = settleSnapTx.current!, sTy = settleSnapTy.current!
                for (let i = 0; i < pathEls.length; i++) {
                    const o = sO[i] + (1 - sO[i]) * eased
                    const s = sS[i] + (1 - sS[i]) * eased
                    const tx = sTx[i] * (1 - eased)
                    const ty = sTy[i] * (1 - eased)
                    pathEls[i].style.opacity = String(o)
                    pathEls[i].style.transform = `translate(${tx}px,${ty}px) scale(${s})`
                }
                if (progress >= 1) {
                    settlingRef.current = false
                    hasEnteredRef.current = true
                }
                rafRef.current = requestAnimationFrame(loop)
                return
            }

            if (!animateRef.current) {
                if (!hasEnteredRef.current) {
                    for (let i = 0; i < pathEls.length; i++) {
                        pathEls[i].style.opacity = "1"
                        pathEls[i].style.transform = "translate(0px,0px) scale(1)"
                    }
                    hasEnteredRef.current = true
                }
                rafRef.current = requestAnimationFrame(loop)
                return
            }

            const elapsed = now - startTime

            if (!entranceDone) {
                // The mark blooms into place: the centre forms first and the
                // outer petals gather inward behind it. Each dot fades + scales
                // with a snappy attack and a soft overshoot, drifting the last
                // few px home — no hard "pop", no slow creep.
                for (let i = 0; i < pathEls.length; i++) {
                    const dot = PREM_DOTS[i]
                    const normDist = dot.dist / MAX_DIST
                    const dotDelay = normDist * REVEAL_STAGGER
                    const p = Math.max(0, Math.min(1, (elapsed - dotDelay) / REVEAL_DUR))
                    const fade = easeOutExpo(p)
                    const scale = 0.72 + 0.28 * easeOutBackSoft(p)
                    const gather = (1 - fade) * GATHER_AMOUNT
                    const tx = (dot.cx - CENTER_X) * gather
                    const ty = (dot.cy - CENTER_Y) * gather
                    pathEls[i].style.opacity = String(fade)
                    pathEls[i].style.transform = `translate(${tx}px,${ty}px) scale(${scale})`
                }
                if (elapsed > ENTRANCE_DURATION + 500) {
                    entranceDone = true
                    hasEnteredRef.current = true
                    if (once) return
                    modeTime = now

                    for (let i = 0; i < pathEls.length; i++) {
                        snapOpacity[i] = 1
                        snapScale[i] = 1
                        snapTx[i] = 0
                        snapTy[i] = 0
                    }
                }
            } else {
                const sinceMode = now - modeTime
                if (sinceMode > MODE_DURATION) {

                    for (let i = 0; i < pathEls.length; i++) {
                        snapOpacity[i] = getOpacity(mode, i, sinceMode)
                        snapScale[i] = getScale(mode, i, sinceMode)
                        const [tx, ty] = getTranslate(mode, i, sinceMode)
                        snapTx[i] = tx
                        snapTy[i] = ty
                    }
                    prevMode = mode
                    if (type !== "random") {

                        modeTime = now
                    } else {
                        const [next, nextIdx] = pickNextMode(modeIdx)
                        mode = next
                        modeIdx = nextIdx
                        modeTime = now
                    }
                }
                const sinceModeCurrent = now - modeTime
                const fadeProgress = Math.min(1, sinceModeCurrent / TRANSITION_MS)
                const easedFade = fadeProgress < 1 ? easeInOutCubic(fadeProgress) : 1

                for (let i = 0; i < pathEls.length; i++) {
                    const opacity = getOpacity(mode, i, sinceModeCurrent)
                    const scale = getScale(mode, i, sinceModeCurrent)
                    const [tx, ty] = getTranslate(mode, i, sinceModeCurrent)
                    const blendedOpacity = easedFade < 1
                        ? snapOpacity[i] * (1 - easedFade) + opacity * easedFade
                        : opacity
                    const blendedScale = easedFade < 1
                        ? snapScale[i] * (1 - easedFade) + scale * easedFade
                        : scale
                    const blendedTx = easedFade < 1
                        ? snapTx[i] * (1 - easedFade) + tx * easedFade
                        : tx
                    const blendedTy = easedFade < 1
                        ? snapTy[i] * (1 - easedFade) + ty * easedFade
                        : ty
                    pathEls[i].style.opacity = String(blendedOpacity)
                    pathEls[i].style.transform = `translate(${blendedTx}px,${blendedTy}px) scale(${blendedScale})`
                }
            }

            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(rafRef.current)
        }
    }, [setupPaths])

    return (
        <div className={cn("relative flex items-center justify-center")} style={{ width, height, minWidth: width }}>
            <svg
                ref={svgRef}
                viewBox="0 0 313 324"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            />
        </div>
    )
})

PremLogoThinking.displayName = "PremLogoThinking"
