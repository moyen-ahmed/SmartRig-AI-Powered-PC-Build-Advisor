from typing import Dict, List, Optional

PROFILES: dict[str, dict] = {
    "gaming": {
        "split": {"cpu": 0.30, "gpu": 0.50, "mobo": 0.20},
        "weights": {"cpu": 0.30, "gpu": 0.70},
    },
    "ai_ml": {
        "split": {"cpu": 0.20, "gpu": 0.60, "mobo": 0.20},
        "weights": {"cpu": 0.20, "gpu": 0.80},
    },
    "video_editing": {
        "split": {"cpu": 0.40, "gpu": 0.40, "mobo": 0.20},
        "weights": {"cpu": 0.50, "gpu": 0.50},
    },
    "office": {
        "split": {"cpu": 0.50, "gpu": 0.10, "mobo": 0.40},
        "weights": {"cpu": 0.80, "gpu": 0.20},
    },
}

def score_build(cpu, gpu, budget, total, weights) -> float:
    cpu_perf = float(cpu.get("perfScore") or 0)
    gpu_perf = float(gpu.get("perfScore") or 0)
    perf = weights["cpu"] * cpu_perf + weights["gpu"] * gpu_perf
    budget_penalty = abs(budget - total) / max(budget, 1.0)
    return perf - 5.0 * budget_penalty  # 5 = penalty weight (tuneable)

async def recommend_build(*, purpose: str, budget: float,
                          cpus: List[dict], gpus: List[dict], mobos: List[dict]) -> Optional[dict]:
    profile = PROFILES.get(purpose)
    if not profile:
        return None

    best = None

    # Pre-index mobos by socket for quick compatibility checks
    mobos_by_socket: Dict[str, List[dict]] = {}
    for m in mobos:
        s = m.get("socket")
        if not s: 
            continue
        mobos_by_socket.setdefault(s, []).append(m)

    for cpu in cpus:
        s = cpu.get("socket")
        if not s or s not in mobos_by_socket:
            continue
        compat_mobos = mobos_by_socket[s]

        for mobo in compat_mobos:
            for gpu in gpus:
                total = float(cpu["price"]) + float(mobo["price"]) + float(gpu["price"])
                if total > budget * 1.05:  # allow tiny overshoot, tweak as you like
                    continue
                sc = score_build(cpu, gpu, budget, total, profile["weights"])
                candidate = {"cpu": cpu, "gpu": gpu, "motherboard": mobo, "totalPrice": total, "score": sc}
                if (best is None) or (candidate["score"] > best["score"]):
                    best = candidate

    return best
