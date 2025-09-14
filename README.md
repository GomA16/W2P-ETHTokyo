# W2P Loan

## コマンドとか

- bb のバージョン指定

```
bbup -v 0.87.0
```

- vk の生成

```
bb write_vk -b ./target/<プロジェクト名>.json -o ./target --oracle_hash keccak
```

- verifeir コントラクトの生成

```
bb write_solidity_verifier -k ./target/vk -o ./target/<コントラクト名>.sol
```

- proof の生成

```
bb prove -b ./target/<プロジェクト名>.json -w ./target/<プロジェクト名>.gz -o ./target --oracle_hash keccak --output_format bytes_and_fields
```

```
 tsc test.ts --resolveJsonModule --esModuleInterop --skipLibCheck --downleveliteration; node test.js
```
