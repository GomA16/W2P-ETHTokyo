# W2P Loan

## コマンドとか

- bbのバージョン指定 
```
bbup -v 0.87.0
```

- vkの生成
```
bb write_vk -b ./target/<プロジェクト名>.json -o ./target --oracle_hash keccak
```

- verifeirコントラクトの生成
```
bb write_solidity_verifier -k ./target/vk -o ./target/<コントラクト名>.sol 
```

- proofの生成
```
bb prove -b ./target/<プロジェクト名>.json -w ./target/<プロジェクト名>.gz -o ./target --oracle_hash keccak --output_format bytes_and_fields                  
```