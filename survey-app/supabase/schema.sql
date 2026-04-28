-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 问卷表
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID NOT NULL,
    is_public BOOLEAN DEFAULT true,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 问题表
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('single', 'multiple', 'text', 'dropdown', 'rating')),
    title TEXT NOT NULL,
    options TEXT[],
    required BOOLEAN DEFAULT true,
    order_num INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 响应表
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建索引
CREATE INDEX idx_surveys_creator ON surveys(creator_id);
CREATE INDEX idx_questions_survey ON questions(survey_id);
CREATE INDEX idx_responses_survey ON responses(survey_id);

-- 启用 RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Public surveys are viewable by everyone"
    ON surveys FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own surveys"
    ON surveys FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own surveys"
    ON surveys FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own surveys"
    ON surveys FOR UPDATE
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own surveys"
    ON surveys FOR DELETE
    USING (auth.uid() = creator_id);

CREATE POLICY "Questions are viewable with surveys"
    ON questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND (surveys.is_public = true OR surveys.creator_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert questions for their surveys"
    ON questions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND surveys.creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can update questions for their surveys"
    ON questions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND surveys.creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete questions for their surveys"
    ON questions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND surveys.creator_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert responses"
    ON responses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Responses are viewable by survey owners"
    ON responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = responses.survey_id
            AND surveys.creator_id = auth.uid()
        )
    );
