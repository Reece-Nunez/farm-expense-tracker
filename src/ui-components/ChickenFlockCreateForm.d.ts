/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ChickenFlockCreateFormInputValues = {
    breed?: string;
    count?: number;
    notes?: string;
};
export declare type ChickenFlockCreateFormValidationValues = {
    breed?: ValidationFunction<string>;
    count?: ValidationFunction<number>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChickenFlockCreateFormOverridesProps = {
    ChickenFlockCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    breed?: PrimitiveOverrideProps<TextFieldProps>;
    count?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ChickenFlockCreateFormProps = React.PropsWithChildren<{
    overrides?: ChickenFlockCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ChickenFlockCreateFormInputValues) => ChickenFlockCreateFormInputValues;
    onSuccess?: (fields: ChickenFlockCreateFormInputValues) => void;
    onError?: (fields: ChickenFlockCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChickenFlockCreateFormInputValues) => ChickenFlockCreateFormInputValues;
    onValidate?: ChickenFlockCreateFormValidationValues;
} & React.CSSProperties>;
export default function ChickenFlockCreateForm(props: ChickenFlockCreateFormProps): React.ReactElement;
