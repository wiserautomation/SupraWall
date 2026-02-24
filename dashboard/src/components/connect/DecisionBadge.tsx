import { cn } from "@/lib/utils";

const styles = {
    ALLOW: "bg-green-100 text-green-800 border-green-200",
    DENY: "bg-red-100 text-red-800 border-red-200",
    REQUIRE_APPROVAL: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const labels = {
    ALLOW: "Allow",
    DENY: "Deny",
    REQUIRE_APPROVAL: "Needs Approval",
};

export function DecisionBadge({
    decision,
}: {
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                styles[decision]
            )}
        >
            {labels[decision]}
        </span>
    );
}
