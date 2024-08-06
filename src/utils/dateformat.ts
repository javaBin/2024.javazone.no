export const dayAndMonthFormat = Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long"
})

export const dayAndTimeFormat = Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
})
