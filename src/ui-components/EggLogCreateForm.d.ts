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
export declare type EggLogCreateFormInputValues = {
    sub?: string;
    date?: string;
    eggsCollected?: number;
    chickenFlockID?: string;
};
export declare type EggLogCreateFormValidationValues = {
    sub?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    eggsCollected?: ValidationFunction<number>;
    chickenFlockID?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EggLogCreateFormOverridesProps = {
    EggLogCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    eggsCollected?: PrimitiveOverrideProps<TextFieldProps>;
    chickenFlockID?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EggLogCreateFormProps = React.PropsWithChildren<{
    overrides?: EggLogCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: EggLogCreateFormInputValues) => EggLogCreateFormInputValues;
    onSuccess?: (fields: EggLogCreateFormInputValues) => void;
    onError?: (fields: EggLogCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EggLogCreateFormInputValues) => EggLogCreateFormInputValues;
    onValidate?: EggLogCreateFormValidationValues;
} & React.CSSProperties>;
export default function EggLogCreateForm(props: EggLogCreateFormProps): React.ReactElement;
