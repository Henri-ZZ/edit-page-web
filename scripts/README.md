# Scripts

这个目录放的是 `edit-page-web` 的本地管理脚本。

## 当前可用脚本

### `create-manual-license.mjs`

这个脚本可以**不经过 Paddle 支付流程**，直接往数据库里创建或更新一条 license 记录。

适合这些场景：

- 生成 Chrome Web Store 审核专用激活码
- 给用户手动补发一个 license
- 生成 production 测试激活码，而不用真的付款

脚本执行完成后会：

- 往 `licenses` 表写入一条记录
- 在终端输出这条 license 的**明文激活码**

注意：

- 数据库里只保存 `license_key_hash`，不会保存明文激活码
- 所以脚本输出的激活码请当场保存好

## 依赖的环境变量

脚本从当前 shell 环境里读取这些变量：

- `POSTGRES_URL`
  首选数据库连接串。建议优先使用这一项。
- `POSTGRES_URL_NON_POOLING`
  可选。用于在 `POSTGRES_URL` 不可用时回退。
- `DATABASE_URL_UNPOOLED`
  可选。用于在前两项都没有时回退。
- `LICENSE_KEY_SECRET`
  当前环境用于生成和校验激活码的 secret

重要说明：

- 如果你要生成 **production 激活码**，就必须使用 **production 的 `POSTGRES_URL`** 和 **production 的 `LICENSE_KEY_SECRET`**
- 如果你要生成 **preview 激活码**，就必须使用 preview 对应的数据库和 secret
- 环境不要混用，否则生成出来的码会无法在目标环境里使用

## 基本用法

```bash
POSTGRES_URL='你的数据库连接串' \
LICENSE_KEY_SECRET='你的 LICENSE_KEY_SECRET' \
npm run create:license -- someone@example.com
```

这个命令会：

- 自动生成一个 `manual_时间戳` 格式的 `orderId`
- 默认创建一条 `lifetime` 类型的 license
- 最后输出 JSON 结果，其中包含可直接使用的 `licenseKey`

## 可选参数

### `--order-id=...`

手动指定订单号，而不是使用自动生成的 `manual_<timestamp>`

适合：

- 给 Chrome Web Store 审核准备固定订单号
- 以后重复执行同一个命令时覆盖同一条记录

### `--plan=lifetime`

可选值：

- `lifetime`
- `custom`

如果不传，默认就是 `lifetime`

### `--price-id=pri_xxx`

可选。用于把 Paddle price id 一起保存进数据库。

如果只是手动生成一个测试用或审核用激活码，不填也可以。

## 示例：生成 Chrome Web Store 审核专用激活码

```bash
POSTGRES_URL='你的 production 数据库连接串' \
LICENSE_KEY_SECRET='你的 production LICENSE_KEY_SECRET' \
npm run create:license -- review@editpage.local --order-id=manual_cws_review_001 --plan=lifetime
```

## 示例输出

```json
{
  "email": "someone@example.com",
  "orderId": "manual_1713000000000",
  "plan": "lifetime",
  "priceId": null,
  "licenseKey": "ABCDE-FGHIJ-KLMNO-PQRST"
}
```

其中：

- `email`：这条 license 绑定的邮箱
- `orderId`：数据库里记录的订单号
- `plan`：license 类型
- `priceId`：对应的 Paddle price id（如果有）
- `licenseKey`：真正给用户或审核员使用的激活码

## 覆盖行为

如果你使用**同一个 `orderId`** 再执行一次脚本：

- 不会新增一条新的订单记录
- 而是会更新原来的那条 license

所以：

- 如果你想生成一条全新的测试 license，请换一个新的 `orderId`
- 如果你想更新某条已有记录，可以继续使用同一个 `orderId`

## 当前 license 的设备数限制

这个脚本生成的 license 会沿用当前系统默认设置：

- 最多支持 2 台设备

## 本地执行卡住怎么办

如果命令执行时看起来一直卡住，最常见原因是数据库连接串的问题。

建议优先检查：

1. `POSTGRES_URL` 是否可用
2. 如果 `POSTGRES_URL` 连不上，再尝试 `POSTGRES_URL_NON_POOLING`
3. 如果还不行，再尝试 `DATABASE_URL_UNPOOLED`

如果本地脚本卡住，通常优先尝试：

- 先使用 Vercel 里的 `POSTGRES_URL`
- 如果出现 `CONNECT_TIMEOUT`，再改试 `POSTGRES_URL_NON_POOLING` 或 `DATABASE_URL_UNPOOLED`
- 尽量直接使用 Vercel / Neon 自动生成的连接串，不要自己手动拼接参数

## 新版脚本输出说明

脚本现在会在执行过程中打印这些信息：

- 正在使用哪一个环境变量作为数据库连接串
- 目标数据库主机（已做脱敏，不会打印用户名和密码）
- 是否已经成功连接数据库
- 是否已经完成 license 写入

如果连接超时，会额外提示你下一步该优先尝试哪一条连接串。

## 目前状态

当前 `scripts` 目录里暂时只有一个功能：

- `create-manual-license.mjs`

后面如果再加：

- revoke license
- list licenses
- query activations

也会继续在这个 README 里补充说明。
