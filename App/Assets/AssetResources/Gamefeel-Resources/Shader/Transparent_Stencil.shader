Shader "My Shader/UI/Transparent_Stencil" {
    Properties 
        {
            [PerRendererData]_MainTex ("Particle Texture", 2D) = "white" {}

            [Space(15)]
            [Header(Blend Factors)]    [Space(10)]
            _AlphaClip ("Alpha Clip Threshold", Range (0,1)) = 0.001
            [Enum(UnityEngine.Rendering.BlendMode)]
            _BlendSrcFactor ("Blend Src Factor", Float) = 0
            [Enum(UnityEngine.Rendering.BlendMode)]
            _BlendDstFactor ("Blend Dst Factor", Float) = 0

            [Space(15)]
            [Header(Stencil Properties)]    [Space(10)]
            _Stencil("Stencil Ref ID", Float) = 0.0
            [Enum(UnityEngine.Rendering.CompareFunction)]
            _StencilComp ("Stencil Comp", Float) = 1
            [Enum(UnityEngine.Rendering.StencilOp)]
            _StencilOp ("Stencil Pass Op", Float) = 1
            _StencilReadMask ("Read Mask", Range(0,255)) = 255
            _StencilWriteMask ("Write Mask", Range(0,255)) = 255
            _ColorMask ("Color Mask", Float) = 15

            [Toggle(UNITY_UI_ALPHACLIP)] _UseUIAlphaClip ("Use Alpha Clip", Float) = 0
            [Toggle(UNITY_UI_CLIP_RECT)] _UseUIClipRect ("Use Clip Rect", Float) = 0

        }

CGINCLUDE
    #include "UnityCG.cginc"
    #include "UnityUI.cginc"

    #pragma multi_compile_local _ UNITY_UI_CLIP_RECT
    #pragma multi_compile_local _ UNITY_UI_ALPHACLIP

    float4 _ClipRect;
    fixed4 _TextureSampleAdd;
    sampler2D _MainTex;
    float4 _MainTex_ST;
    float _AlphaClip;
   
    struct appdata_t
    {
        float4 vertex   : POSITION;
        float4 color    : COLOR;
        float2 texcoord : TEXCOORD0;
        UNITY_VERTEX_INPUT_INSTANCE_ID
    };
 
    struct v2f
    {
        float4 vertex   : SV_POSITION;
        fixed4 color    : COLOR;
        half2 texcoord  : TEXCOORD0;
        float4 worldPosition : TEXCOORD1;
        UNITY_VERTEX_OUTPUT_STEREO
    };
   
    v2f vert(appdata_t v)
    {
        v2f OUT;
        UNITY_SETUP_INSTANCE_ID(v);
        UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(OUT);
        OUT.worldPosition = v.vertex;
        OUT.vertex = UnityObjectToClipPos(OUT.worldPosition);

        OUT.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);

        OUT.color = v.color;
        return OUT;
    }
 

    fixed4 frag(v2f IN) : SV_Target
    {
        half4 color = (tex2D(_MainTex, IN.texcoord) + _TextureSampleAdd) * IN.color;

        #ifdef UNITY_UI_CLIP_RECT
        color.a *= UnityGet2DClipping(IN.worldPosition.xy, _ClipRect);
        #endif

        #ifdef UNITY_UI_ALPHACLIP
        clip (color.a - _AlphaClip);
        #endif   

        return color;
    }
ENDCG

    SubShader
    {
        Tags
        {
            "Queue"="Transparent"
            "IgnoreProjector"="True"
            "RenderType"="Transparent"
            "PreviewType"="Plane"
            "CanUseSpriteAtlas"="True"
        }

        Blend [_BlendSrcFactor] [_BlendDstFactor]
        ZTest [unity_GUIZTestMode]
        ColorMask [_ColorMask]
        Cull Off Lighting Off ZWrite Off

        Stencil
        {
            Ref [_Stencil]
            Comp [_StencilComp]
            Pass [_StencilOp]
            ReadMask [_StencilReadMask]
            WriteMask [_StencilWriteMask]
        }
        Pass
        {
        CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
        ENDCG
        }
    }
    FallBack "Mobile/Particles/Additive"
}