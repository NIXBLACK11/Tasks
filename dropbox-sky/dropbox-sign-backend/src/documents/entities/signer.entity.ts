import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { SignatureRequest } from "./signature-request.entity";

@Entity("signers")
export class Signer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  signature_id: string;

  @Column()
  signer_email_address: string;

  @Column()
  signer_name: string;

  @Column()
  signer_role: string;

  @Column()
  status_code: string;

  @ManyToOne(() => SignatureRequest, (signatureRequest) => signatureRequest.signers)
  signatureRequest: SignatureRequest;
}
