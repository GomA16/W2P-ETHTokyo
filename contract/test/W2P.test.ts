import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("W2P Contract", function () {
  // テスト全体で使う変数を定義

  // 1. デプロイ処理をfixtureとして定義
  async function deployW2PFixture() {
    // テスト用のアカウント（Signer）を取得
    const [owner, lender1, lender2] = await ethers.getSigners();

    // コントラクトをデプロイ
    const W2P = await ethers.getContractFactory("W2P");
    const w2p = await W2P.deploy();

    return { w2p, owner, lender1, lender2 };
  }

  // --- deposit関数のテスト ---
  describe("Deposit", function () {
    it("Should allow a user to deposit ETH and update balances", async function () {
      const { w2p, lender1 } = await loadFixture(deployW2PFixture);
      const depositAmount = ethers.parseEther("1.0"); // 1 ETH

      // イベントの発行をテストしつつ、deposite関数を実行
      await expect(w2p.connect(lender1).deposit({ value: depositAmount }))
        .to.emit(w2p, "Deposit")
        .withArgs(lender1.address, depositAmount);

      // 状態が正しく更新されたか確認
      expect(await w2p.pooledETH()).to.equal(depositAmount);
      expect(await w2p.depositInfo(lender1.address)).to.equal(depositAmount);
    });

    it("Should revert if deposit amount is zero", async function () {
      const { w2p } = await loadFixture(deployW2PFixture);

      // 0ETHのデポジットがエラーメッセージと共に失敗することを確認
      await expect(w2p.deposit({ value: 0 }))
        .to.be.revertedWith("Deposit amount must be greater than zero");
    });
  });

  // --- withdraw関数のテスト ---
  describe("Withdrawal", function () {
    it("Should allow a user to withdraw their deposited ETH", async function () {
      const { w2p, lender2 } = await loadFixture(deployW2PFixture);
      const depositAmount = ethers.parseEther("5.0");
      const withdrawAmount = ethers.parseEther("2.0");

      // 準備: lender2が5ETHをデポジット
      await w2p.connect(lender2).deposit({ value: depositAmount });

      // イベントの発行をテストしつつ、lender2のETH残高が2ETH増えることを確認
      await expect(
        w2p.connect(lender2).withdraw(withdrawAmount)
      ).to.changeEtherBalance(lender2, withdrawAmount);

        
      // 状態が正しく更新されたか確認
      const expectedPool = ethers.parseEther("3.0"); // 5 - 2 = 3
      expect(await w2p.pooledETH()).to.equal(expectedPool);
      expect(await w2p.depositInfo(lender2.address)).to.equal(expectedPool);
    });

    it("Should revert if trying to withdraw more than deposited", async function () {
      const { w2p, lender1 } = await loadFixture(deployW2PFixture);
      
      // 準備: lender1が1ETHをデポジット
      await w2p.connect(lender1).deposit({ value: ethers.parseEther("1.0") });

      // 3ETHを引き出そうとして失敗することを確認
      const withdrawAmount = ethers.parseEther("3.0");
      await expect(w2p.connect(lender1).withdraw(withdrawAmount))
        .to.be.revertedWith("Trying to withdraw more than you deposited");
    });
  });
});