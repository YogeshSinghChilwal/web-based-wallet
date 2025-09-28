import React, { useState } from "react";
import { Input } from "./ui/input";
import { generateMnemonic, validateMnemonic } from "bip39";
import { Button } from "./ui/button";
import { EyeOff, Copy, ChevronDown } from "lucide-react";

const WalletGenerator = ({ pathType }: { pathType: number }) => {
  const [backupPhrase, setBackupPhrase] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [mnemonicArray, setMnemonicArray] = useState<string[]>([]);
  const [hideMnemonicArray, setHideMnemonicArray] = useState(true);

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data)
  }

  const handleGenerateWallet = () => {
    let mnemonic = backupPhrase.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        console.log("ertgfdsfg")
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    setMnemonic(mnemonic)
    const words = mnemonic.split(" ");
    setMnemonicArray(words);
  };
  return (
    <div>
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
      {mnemonicArray.length > 0 && (
        <div
          className="relative bg-foreground/10 rounded-2xl px-10 pt-4 pb-10 mt-10"
          onMouseLeave={() => setHideMnemonicArray(true)}
        >
          <div className="flex justify-end gap-4 mb-6">
            <Copy className="hover:text-sky-300 cursor-pointer" onClick={() => handleCopy(mnemonic)} />
            <ChevronDown className="hover:text-sky-300 cursor-pointer" />
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
      )}
    </div>
  );
};

export default WalletGenerator;
