export const dayAndMonthFormat = Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long"
})

export const dayAndTimeFormatWithMonth = Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
})

export const dayAndTimeFormat = Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
})
