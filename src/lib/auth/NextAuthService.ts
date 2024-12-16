import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/config/auth.config'
import { Session } from 'next-auth'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface VerificationRequestParams {
    identifier: string
    token: string
    expires: Date
    url: string
}

interface PasswordResetParams {
    identifier: string
    token: string
    expires: Date
    url: string
}

export class NextAuthService {
    /**
     * Get the current session
     */
    static async getSession(): Promise<Session | null> {
        return await getServerSession(authOptions)
    }

    /**
     * Get the current authenticated user
     */
    static async getCurrentUser() {
        const session = await this.getSession()
        return session?.user
    }

    /**
     * Require authentication and return user data
     * @throws {Error} If user is not authenticated
     */
    static async requireAuth() {
        const user = await this.getCurrentUser()
        if (!user) {
            throw new Error('認証が必要です')
        }
        return user
    }

    /**
     * Create an unauthorized response
     */
    static createUnauthorizedResponse(message: string = '認証が必要です') {
        return new NextResponse(message, { status: 401 })
    }
}

export async function sendVerificationRequest({
    identifier,
    token,
    expires,
    url,
}: VerificationRequestParams) {
    const { host } = new URL(url)

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })

    const result = await transport.sendMail({
        to: identifier,
        from: process.env.EMAIL_FROM,
        subject: `【${host}】メールアドレスの確認`,
        text: text({ url, host }),
        html: html({ url, host }),
    })

    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`メールの送信に失敗しました: ${failed.join(', ')}`)
    }
}

function html({ url, host }: { url: string; host: string }) {
    const escapedHost = host.replace(/\./g, '&#8203;.')

    return `
    <body>
      <h2>${escapedHost}をご利用いただきありがとうございます。</h2>
      <p>以下のリンクをクリックして、メールアドレスの確認を完了してください：</p>
      <p><a href="${url}">メールアドレスを確認する</a></p>
      <p>このリンクは24時間後に無効となります。</p>
      <p>このメールに心当たりがない場合は、無視していただいて構いません。</p>
      <hr/>
      <p>よろしくお願いいたします。</p>
      <p>${escapedHost} チーム</p>
    </body>
  `
}

function text({ url, host }: { url: string; host: string }) {
    return `
${host}をご利用いただきありがとうございます。

以下のリンクをクリックして、メールアドレスの確認を完了してください：

${url}

このリンクは24時間後に無効となります。

このメールに心当たりがない場合は、無視していただいて構いません。

よろしくお願いいたします。
${host} チーム
  `.trim()
}

export async function sendPasswordResetEmail({
    identifier,
    token,
    expires,
    url,
}: PasswordResetParams) {
    const { host } = new URL(url)

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })

    const result = await transport.sendMail({
        to: identifier,
        from: process.env.EMAIL_FROM,
        subject: `【${host}】パスワードリセットのご案内`,
        text: passwordResetText({ url, host }),
        html: passwordResetHtml({ url, host }),
    })

    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`メールの送信に失敗しました: ${failed.join(', ')}`)
    }
}

function passwordResetHtml({ url, host }: { url: string; host: string }) {
    const escapedHost = host.replace(/\./g, '&#8203;.')

    return `
    <body>
      <h2>${escapedHost}をご利用いただきありがとうございます。</h2>
      <p>以下のリンクをクリックして、パスワードの再設定を行ってください：</p>
      <p><a href="${url}">パスワードを再設定する</a></p>
      <p>このリンクは24時間後に無効となります。</p>
      <p>このメールに心当たりがない場合は、無視していただいて構いません。</p>
      <hr/>
      <p>よろしくお願いいたします。</p>
      <p>${escapedHost} チーム</p>
    </body>
  `
}

function passwordResetText({ url, host }: { url: string; host: string }) {
    return `
${host}をご利用いただきありがとうございます。

以下のリンクをクリックして、パスワードの再設定を行ってください：

${url}

このリンクは24時間後に無効となります。

このメールに心当たりがない場合は、無視していただいて構いません。

よろしくお願いいたします。
${host} チーム
  `.trim()
}
