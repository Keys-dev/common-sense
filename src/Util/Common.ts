import { ClientUser, MessagePayload, PermissionFlagsBits, PermissionsBitField, TextChannel, WebhookMessageOptions } from 'discord.js'

export const MODERATOR = PermissionsBitField.resolve([
    PermissionFlagsBits.BanMembers, PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.UseApplicationCommands
])
export const ADMINISTRATOR = PermissionsBitField.resolve(PermissionFlagsBits.Administrator)

export const MAX_32_BIT_SIGNED = 2_147_483_647

export const MS_REGEXP = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i

export async function defaultImport<T>(path: string): Promise<T> {
    return (await import(path))?.default

}
export async function sendWebhook(client: ClientUser, channel: TextChannel, payload: MessagePayload | Omit<WebhookMessageOptions, 'flags'>): Promise<void> {
    let webhook = await channel.createWebhook({
        name: client.username,
        avatar: client.displayAvatarURL({ extension: 'png', size: 1024 })
    })
    
    try {
        await webhook.send(payload)
        await webhook.delete()
    } catch (error) {
        console.error(error)
    }
}
export function setLongTimeout<T extends any[]>(callback: (...args: T) => void, timeout: number, ...args: T): NodeJS.Timer {
    let iterations = 0
    let maxIterations = timeout / MAX_32_BIT_SIGNED
    let timer: NodeJS.Timer

    return timer = setInterval(function onInterval() {
        iterations++

        if (iterations > maxIterations) {
            clearInterval(timer)
            callback(...args)
        }
    })
}
export function getTime(): string {
    let date = new Date

    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map(n => n.toString().padStart(2, '0'))
        .join(':')
}