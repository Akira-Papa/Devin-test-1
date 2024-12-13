import { useState } from "react"
import { Bell, Key, Lock, Sun, User } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null as File | null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData(prev => ({ ...prev, email }))
    if (email && !validateEmail(email)) {
      setEmailError("有効なメールアドレスを入力してください")
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      setEmailError("有効なメールアドレスを入力してください")
      return
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">ユーザー設定</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full justify-start gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              プロフィール
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Key size={16} />
              アカウント
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              通知
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Sun size={16} />
              表示設定
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock size={16} />
              プライバシー
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>プロフィール設定</CardTitle>
                <CardDescription>
                  あなたの基本情報を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    placeholder="山田 太郎"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="taro@example.com"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>プロフィール画像</Label>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <Button variant="secondary" size="lg">画像をアップロード</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>アカウント設定</CardTitle>
                <CardDescription>
                  セキュリティ関連の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">現在のパスワード</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新しいパスワード</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>二段階認証</Label>
                    <div className="text-sm text-gray-500">
                      セキュリティを強化するため、ログイン時に確認コードを要求します
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  通知の受け取り方を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>メール通知</Label>
                    <div className="text-sm text-gray-500">
                      重要なお知らせをメールで受け取ります
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>プッシュ通知</Label>
                    <div className="text-sm text-gray-500">
                      ブラウザでプッシュ通知を受け取ります
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>表示設定</CardTitle>
                <CardDescription>
                  アプリケーションの表示方法を設定します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">言語</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="言語を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="タイムゾーンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="america-la">America/Los_Angeles (GMT-7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ダークモード</Label>
                    <div className="text-sm text-gray-500">
                      ダークテーマに切り替えます
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>プライバシー設定</CardTitle>
                <CardDescription>
                  プライバシーとデータ共有の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">プロフィールの公開範囲</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="公開範囲を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">全員に公開</SelectItem>
                      <SelectItem value="friends">友達のみ</SelectItem>
                      <SelectItem value="private">非公開</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>データ分析の共有</Label>
                    <div className="text-sm text-gray-500">
                      サービス改善のための利用データの共有を許可します
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-end gap-4">
          <Button
            variant="outline"
            size="lg"
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "保存中..." : "変更を保存"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
