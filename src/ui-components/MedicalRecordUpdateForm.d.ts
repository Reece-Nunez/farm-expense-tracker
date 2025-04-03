/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { MedicalRecord } from "../models";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MedicalRecordUpdateFormInputValues = {
    livestockID?: string;
    date?: string;
    description?: string;
    medicine?: string;
};
export declare type MedicalRecordUpdateFormValidationValues = {
    livestockID?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    medicine?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MedicalRecordUpdateFormOverridesProps = {
    MedicalRecordUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    livestockID?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    medicine?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MedicalRecordUpdateFormProps = React.PropsWithChildren<{
    overrides?: MedicalRecordUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    medicalRecord?: MedicalRecord;
    onSubmit?: (fields: MedicalRecordUpdateFormInputValues) => MedicalRecordUpdateFormInputValues;
    onSuccess?: (fields: MedicalRecordUpdateFormInputValues) => void;
    onError?: (fields: MedicalRecordUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MedicalRecordUpdateFormInputValues) => MedicalRecordUpdateFormInputValues;
    onValidate?: MedicalRecordUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MedicalRecordUpdateForm(props: MedicalRecordUpdateFormProps): React.ReactElement;
