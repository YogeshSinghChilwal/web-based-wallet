import React, { useState } from "react";
import { Input } from "./ui/input";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Button } from "./ui/button";
import { EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

type Wallet = {
  publicKey: string;
  privateKey: string;
  path: string;
  mnemonic: string;
};

const WalletGenerator = ({
  pathType,
  walletType,
}: {
  pathType: number;
  walletType: "" | "Solana";
}) => {
  const [backupPhrase, setBackupPhrase] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [mnemonicArray, setMnemonicArray] = useState<string[]>([]);
  const [hideMnemonicArray, setHideMnemonicArray] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data);
    toast.success("Copied");
  };

  const generateWalletWithMnemonic = (
    pathType: number,
    mnemonic: string,
    walletID: number
  ): Wallet => {
    const path = `m/44'/${pathType}'/${walletID}'/0'`; // derivation path
    const seed = mnemonicToSeedSync(mnemonic);
    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);

    const privateKey = bs58.encode(secretKey);
    const publicKey = keypair.publicKey.toBase58();

    return {
      publicKey,
      privateKey,
      path,
      mnemonic,
    };
  };

  const handleGenerateWallet = () => {
    let mnemonic = backupPhrase.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        toast.error("Invalid seed");
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    setMnemonic(mnemonic);
    const words = mnemonic.split(" ");
    setMnemonicArray(words);

    const newWallet = generateWalletWithMnemonic(
      pathType,
      mnemonic,
      wallets.length
    );

    setWallets([...wallets, newWallet]);
  };

  const handleAddNewWallet = () => {
    const newWallet = generateWalletWithMnemonic(
      pathType,
      mnemonic,
      wallets.length
    );

    setWallets([...wallets, newWallet]);
  };
  return (
    <div>
      {mnemonicArray.length > 0 ? (
        <div>
          <h2 className="text-2xl">Your Backup Phrases</h2>
          <div
            className="relative bg-foreground/10 rounded-2xl px-10 pt-4 pb-10 mt-6"
            onMouseLeave={() => setHideMnemonicArray(true)}
          >
            <div className="flex justify-end mb-6">
              <Copy
                className="hover:text-sky-300 cursor-pointer"
                onClick={() => handleCopy(mnemonic)}
              />
            </div>
            {hideMnemonicArray && (
              <div className="absolute rounded-2xl backdrop-blur-sm text-4xl inset-0 flex justify-center items-center">
                <div onClick={() => setHideMnemonicArray((pre) => !pre)}>
                  <EyeOff className="w-20 h-20 cursor-pointer" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-10">
              {mnemonicArray.map((value, key) => (
                <div key={key}>
                  <Button size={"lg"}>{value}</Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center ">
              <h2 className="text-2xl">{walletType} Wallet</h2>
              <div className="flex gap-4">
                <Button variant={"outline"} onClick={handleAddNewWallet}>
                  Add New Wallet
                </Button>
                <Button variant={"destructive"}>Remove all Wallets</Button>
              </div>
            </div>
          </div>
          {wallets.length > 0 && (
            <div className="mt-6">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="bg-zinc-100 dark:bg-zinc-900 px-6 py-4 rounded-2xl mt-4"
                >
                  <div>
                    <h3 className="text-2xl">Wallet {index + 1}</h3>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">Public Key</h3>
                    <p>{wallet.publicKey}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">Private Key</h3>
                    <p>{wallet.privateKey}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl">Backup Phrase</h2>
            <p className="text-sm text-foreground/60">
              Do not share; keep private and safe.
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <Input
              type="password"
              placeholder="Input your backup phrase (or generate a new one)."
              value={backupPhrase}
              onChange={(e) => setBackupPhrase(e.target.value)}
            />
            <Button onClick={handleGenerateWallet}>
              {backupPhrase.length > 0
                ? "Add Existing Wallet"
                : "Generate New Wallet"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletGenerator;
