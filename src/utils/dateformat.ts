export const dayAndMonthFormat = Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long"
})

export const dayAndTimeFormat = Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
})
