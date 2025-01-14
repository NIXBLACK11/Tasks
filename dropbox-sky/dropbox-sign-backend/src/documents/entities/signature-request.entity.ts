import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Signer } from "./signer.entity";

@Entity("signature_requests")
export class SignatureRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  signature_request_id: string;

  @Column({ default: false })
  is_complete: boolean;

  @Column({ default: false })
  is_declined: boolean;

  @Column({ nullable: true })
  final_copy_url: string;

  @Column({ nullable: true })
  details_url: string;

  @Column()
  template_id: string;

  @OneToMany(() => Signer, (signer) => signer.signatureRequest, { cascade: true })
  signers: Signer[];
}
